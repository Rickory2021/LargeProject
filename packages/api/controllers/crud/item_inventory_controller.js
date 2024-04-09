// Rename to business_operations.js?
const { LocationInventory } = require('../../models/business_model');
const GenericCRUDController = require('./generic_crud_controller');
const { Business } = require('../../models/business_model');
const { createLog } = require('./item_location_log_controller');

const mongoose = require('mongoose');

class ItemInventoryController extends GenericCRUDController {
  constructor() {
    super();
  }

  async doesExistItem(businessId, field, value) {
    try {
      let doesExist = await super.doesExistGeneric(businessId, field, value);
      return doesExist;
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  async doesExistLocationName(businessId, itemName, locationName) {
    try {
      const locationInfo = await Business.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(businessId) } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': itemName } },
        { $project: { locationItemList: '$itemList.locationItemList' } },
        { $unwind: '$locationItemList' },
        { $match: { 'locationItemList.locationName': locationName } },
        { $project: { locationName: '$locationItemList.locationName' } }
      ]);
      console.log(locationInfo);
      if (locationInfo.length === 0) {
        console.log(
          `locationInfo '${locationName}' not found for item '${itemName}' in business '${businessId}'`
        );
        return false;
      } else {
        console.log(
          `locationInfo '${locationName}' found for item '${itemName}' in business '${businessId}'`
        );
        return true;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  async doesExistLocationMetaData(businessId, locationName) {
    try {
      const locationMetaData = await this.doesExistGeneric(
        businessId,
        'locationMetaDataList.locationName',
        locationName
      );
      console.log(locationMetaData);
      if (locationMetaData.length === 0) {
        console.log(
          `locationMetaData '${locationName}' not found in business '${businessId}'`
        );
        return false;
      } else {
        console.log(
          `locationMetaData '${locationName}' found for in business '${businessId}'`
        );
        return true;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  //req.query.businessId  { itemName, locationName, portionNumber, metaData }
  async createInventory(req, res) {
    let businessId = req.query.businessId;
    let { itemName, locationName, portionNumber, metaData, logReason } =
      req.body;
    console.log(
      `businessId:${businessId} itemName :${itemName} locationName :${locationName} portionNumber :${portionNumber} metaData :${metaData}`
    );
    try {
      console.log('About to create');
      const locationInventoryObject = new LocationInventory({
        portionNumber,
        metaData
      });
      const statusDetails = await super.createGenericByQuery(
        {
          _id: businessId,
          'itemList.itemName': itemName,
          'itemList.locationItemList.locationName': locationName
        },
        {
          $push: {
            'itemList.$[item].locationItemList.$[location].inventoryList':
              locationInventoryObject
          }
        },
        {
          arrayFilters: [
            { 'item.itemName': itemName },
            { 'location.locationName': locationName }
          ]
        }
      );
      if (statusDetails && statusDetails.modifiedCount > 0) {
        console.log('Documents were modified successfully.');
        const mockReq = {
          query: { businessId: businessId },
          body: {
            itemName: itemName,
            locationName: locationName,
            logReason: logReason,
            initialPortion: 0,
            finalPortion: portionNumber,
            updateDate: new Date().toISOString()
          }
        };
        // Mock res object
        const mockRes = {
          statusCode: 200, // Default status code
          data: null, // Placeholder for response data
          send: function (data) {
            this.data = data;
          },
          json: function (data) {
            this.data = data;
          },
          status: function (code) {
            this.statusCode = code;
            return this; // Return itself to allow chaining methods
          }
        };
        createLog(mockReq, mockRes);
      }
      return res.status(200).json({ statusDetails: statusDetails });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName, locationName }
  async readAllInventory(req, res) {
    try {
      const businessId = req.query.businessId;
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      let { itemName, locationName } = req.body;
      console.log('About to read');
      const fieldValues = await super.readGeneric([
        {
          $match: {
            _id: mongooseBusinessID,
            'itemList.locationItemList.locationName': locationName
          }
        },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': itemName } },
        {
          $project: {
            locationItemList: {
              $filter: {
                input: '$itemList.locationItemList',
                as: 'locationItem',
                cond: { $eq: ['$$locationItem.locationName', locationName] }
              }
            }
          }
        },
        { $unwind: '$locationItemList' },
        {
          $project: {
            _id: 0,
            inventoryList: '$locationItemList.inventoryList'
          }
        }
      ]);

      //req.query.printedFieldName
      return res.status(200).json({ outputList: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateInventoryNumber(req, res) {
    const { itemName, findLocationName, index, newNumber, logReason } =
      req.body;
    const businessId = req.query.businessId;
    try {
      console.log('About to update');
      const business = await Business.findById(businessId);

      // Check if the business exists
      if (!business) {
        console.log('Business not found');
        return res.status(500).json({ error: 'Business not found' });
      }

      // Find the item within the business's itemList by itemName
      const item = business.itemList.find(item => item.itemName === itemName);

      // Check if the item exists
      if (!item) {
        console.log('Item not found');
        return res.status(500).json({ error: 'Item not found' });
      }

      // Find the location item within the item's locationItemList by locationName
      const locationItem = item.locationItemList.find(
        locationItem => locationItem.locationName === findLocationName
      );

      // Check if the location item exists
      if (!locationItem) {
        console.log('Location item not found');
        return res.status(500).json({ error: 'Location item not found' });
      }
      let initialPortion;
      // Update the portionNumber at the specified index
      if (index >= 0 && index < locationItem.inventoryList.length) {
        initialPortion = locationItem.inventoryList[index].portionNumber;
        locationItem.inventoryList[index].portionNumber = newNumber;
      } else {
        console.log('Invalid index');
        return res.status(500).json({ error: 'Invalid index' });
      }

      // Save the changes to the database
      const statusDetails = await business.save();
      if (statusDetails) {
        console.log('Documents were modified successfully.');
        const mockReq = {
          query: { businessId: businessId },
          body: {
            itemName: itemName,
            locationName: findLocationName,
            logReason: logReason,
            initialPortion: initialPortion,
            finalPortion: newNumber,
            updateDate: new Date().toISOString()
          }
        };
        // Mock res object
        const mockRes = {
          statusCode: 200, // Default status code
          data: null, // Placeholder for response data
          send: function (data) {
            this.data = data;
          },
          json: function (data) {
            this.data = data;
          },
          status: function (code) {
            this.statusCode = code;
            return this; // Return itself to allow chaining methods
          }
        };
        createLog(mockReq, mockRes);
      }
      console.log('Portion number updated successfully');
      return res.status(200).json({ statusDetails: [statusDetails] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName, findLocationName, index, newMetaData }
  async updateInventoryMetaData(req, res) {
    const { itemName, findLocationName, index, newMetaData } = req.body;
    const businessId = req.query.businessId;
    try {
      console.log('About to update');
      const business = await Business.findById(businessId);

      // Check if the business exists
      if (!business) {
        console.log('Business not found');
        return res.status(500).json({ error: 'Business not found' });
      }

      // Find the item within the business's itemList by itemName
      const item = business.itemList.find(item => item.itemName === itemName);

      // Check if the item exists
      if (!item) {
        console.log('Item not found');
        return res.status(500).json({ error: 'Item not found' });
      }

      // Find the location item within the item's locationItemList by locationName
      const locationItem = item.locationItemList.find(
        locationItem => locationItem.locationName === findLocationName
      );

      // Check if the location item exists
      if (!locationItem) {
        console.log('Location item not found');
        return res.status(500).json({ error: 'Location item not found' });
      }

      // Update the portionNumber at the specified index
      if (index >= 0 && index < locationItem.inventoryList.length) {
        locationItem.inventoryList[index].metaData = newMetaData;
      } else {
        console.log('Invalid index');
        return res.status(500).json({ error: 'Invalid index' });
      }

      // Save the changes to the database
      const statusDetails = await business.save();
      console.log('Portion number updated successfully');
      return res.status(200).json({ statusDetails: [statusDetails] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId { itemName, locationName, index }
  async deleteInventory(req, res) {
    const businessId = req.query.businessId;
    const { itemName, locationName, index } = req.body;
    try {
      // Find the business by ID
      const business = await Business.findById(businessId);

      // Check if the business exists
      if (!business) {
        console.log('Business not found');
        return res.status(500).json({ error: 'Business not found' });
      }

      // Find the item within the business's itemList by itemName
      const item = business.itemList.find(item => item.itemName === itemName);

      // Check if the item exists
      if (!item) {
        console.log('Item not found');
        return res.status(500).json({ error: 'Item not found' });
      }

      // Find the location item within the item's locationItemList by locationName
      const locationItem = item.locationItemList.find(
        locationItem => locationItem.locationName === locationName
      );

      // Check if the location item exists
      if (!locationItem) {
        console.log('Location item not found');
        return res.status(500).json({ error: 'Location item not found' });
      }

      // Delete the element at the specified index
      if (index >= 0 && index < locationItem.inventoryList.length) {
        locationItem.inventoryList.splice(index, 1);
      } else {
        console.log('Invalid index');
        return res.status(500).json({ error: 'Invalid index' });
      }

      // Save the changes to the database
      const statusData = await business.save();
      console.log('Inventory item deleted successfully');
      return res.status(200).json({ statusDetails: [statusData] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
let itemInventoryController = new ItemInventoryController();
module.exports = {
  createInventory: (req, res) =>
    itemInventoryController.createInventory(req, res),
  readAllInventory: (req, res) =>
    itemInventoryController.readAllInventory(req, res),
  updateInventoryNumber: (req, res) =>
    itemInventoryController.updateInventoryNumber(req, res),
  updateInventoryMetaData: (req, res) =>
    itemInventoryController.updateInventoryMetaData(req, res),
  deleteInventory: (req, res) =>
    itemInventoryController.deleteInventory(req, res)
};
