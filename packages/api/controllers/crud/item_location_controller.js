// Rename to business_operations.js?
const { LocationInventory } = require('../../models/business_model');
const GenericCRUDController = require('./generic_crud_controller');
const { Business, LocationMetaData } = require('../../models/business_model');

const mongoose = require('mongoose');

class ItemLocationController extends GenericCRUDController {
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

  //req.query.businessId  {itemName, locationName}
  async createItemLocation(req, res) {
    let businessId = req.query.businessId;
    let { itemName, locationName } = req.body;
    console.log(
      `businessId:${businessId} itemName :${itemName} locationName :${locationName}`
    );
    let createItemLocationStatus, createLocationMetadataStatus;

    try {
      console.log('Check if Duplicate Location Name in Item Location');
      let doesExist = await this.doesExistLocationName(
        businessId,
        itemName,
        locationName
      );
      if (doesExist) {
        console.log('DUPLICATE of New Location Name in Item found in item');
        return res
          .status(409)
          .json({ error: 'DUPLICATE New Location Name in Item found in item' });
      }
      console.log('About to create');
      createItemLocationStatus = await super.createGenericByQuery(
        {
          _id: businessId,
          'itemList.itemName': itemName
        },
        {
          $push: {
            'itemList.$.locationItemList': { locationName: locationName }
          }
        }
      );
      // Fetch the updated business document
      const business = await Business.findById(businessId);

      if (!business) {
        console.log('Business not found');
        return res.status(500).json({ error: 'Business not found' });
      }

      // Find the item within the business document by its itemName
      const item = business.itemList.find(item => item.itemName === itemName);

      if (!item) {
        console.log('Item not found in the Business');
        return res
          .status(500)
          .json({ error: 'Item not found in the Business' });
      }

      // Sort the locationItemList array by locationName in alphabetical order
      item.locationItemList.sort((a, b) =>
        a.locationName.localeCompare(b.locationName)
      );

      // Save the changes to the database
      await business.save();
      // Check MetaData
      try {
        // Need locationName to check if the document exists
        const exists = await this.doesExistGeneric(
          businessId,
          'locationMetaDataList.locationName',
          locationName
        );

        if (exists) {
          return res
            .status(400)
            .json({ statusDetails: [createItemLocationStatus] });
        }

        const locationMetaDataObject = {
          locationName: locationName,
          locationAddress: '',
          locationMetaData: ''
        };

        // TODO: Does not account for white space or case
        createLocationMetadataStatus = await super.createGeneric(
          businessId,
          'locationMetaDataList',
          LocationMetaData,
          locationMetaDataObject
        );

        if (
          createLocationMetadataStatus &&
          createLocationMetadataStatus.modifiedCount > 0
        ) {
          return res.status(200).json({
            statusDetails: [
              createItemLocationStatus,
              createLocationMetadataStatus
            ]
          });
        } else {
          return res.status(400).json({
            statusDetails: [
              createItemLocationStatus,
              createLocationMetadataStatus
            ]
          });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ createItemLocationStatus, error: error.message });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName }
  async readAllItemLocationName(req, res) {
    try {
      const businessId = req.query.businessId;
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      let { itemName } = req.body;
      console.log('About to read');
      const fieldValues = await super.readGeneric([
        { $match: { _id: mongooseBusinessID } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': itemName } },
        {
          $project: {
            _id: 0,
            locationName: '$itemList.locationItemList.locationName'
          }
        }
      ]);

      //req.query.printedFieldName
      return res.status(200).json({ outputList: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName, locationName }
  async readOneItemLocation(req, res) {
    try {
      const businessId = req.query.businessId;
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      let { itemName, locationName } = req.body;
      console.log('About to read');
      const fieldValues = await super.readGeneric([
        { $match: { _id: mongooseBusinessID } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': itemName } },
        { $project: { locationItemList: '$itemList.locationItemList' } },
        { $unwind: '$locationItemList' },
        { $match: { 'locationItemList.locationName': locationName } },
        {
          $project: {
            _id: 0,
            itemName: '$locationItemList.locationName',
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

  //req.query.businessId  { itemName, findLocationName, newLocationName }
  async updateItemLocationName(req, res) {
    const { itemName, findLocationName, newLocationName } = req.body;
    const businessId = req.query.businessId;
    try {
      console.log('Check if Duplicate locationName');
      let doesExist = await this.doesExistLocationName(
        businessId,
        itemName,
        newLocationName
      );
      if (doesExist) {
        console.log('DUPLICATE of newLocationName found in item');
        return res
          .status(409)
          .json({ error: 'DUPLICATE newLocationName found in item' });
      }
      console.log('About to update');
      const fieldValues = await super.updateGeneric(
        {
          _id: businessId,
          'itemList.itemName': itemName,
          'itemList.locationItemList.locationName': findLocationName
        },
        {
          $set: {
            'itemList.$[item].locationItemList.$[portion].locationName':
              newLocationName
          }
        },
        {
          arrayFilters: [
            { 'item.itemName': itemName }, // Filter for the correct item
            { 'portion.locationName': findLocationName } // Filter for the correct portion info
          ]
        }
      );
      return res.status(200).json({ outputList: [fieldValues] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId { itemName, locationName }
  async deleteItemLocation(req, res) {
    const businessId = req.query.businessId;
    const { itemName, locationName } = req.body;
    try {
      const statusData = await super.deleteGenericByQuery(
        {
          _id: businessId,
          'itemList.itemName': itemName,
          'itemList.locationItemList.locationName': locationName
        },
        {
          $pull: {
            'itemList.$.locationItemList': { locationName: locationName }
          }
        }
      );
      return res.status(200).json({ statusDetails: [statusData] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getOneRecentDate(req, res) {
    try {
      const businessId = req.query.businessId;
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      let { itemName, locationName } = req.body;
      const business = await Business.findById(businessId);

      if (!business) {
        throw new Error('Business not found');
      }

      // Step 2: Filter the item in the itemList of the business document by itemName
      const item = business.itemList.find(item => item.itemName === itemName);

      if (!item) {
        throw new Error('Item not found');
      }
      let locationItemLog, sortedLogs;
      for (let i = 0; i < 5; i++) {
        const currentDate = new Date();

        // Get the current year
        let currentYear = currentDate.getFullYear();
        let testYear = currentYear - i;
        // Step 3: Search the locationItemLog within the item for logs with the provided locationName
        locationItemLog = item.locationItemLog.find(
          log => log.locationBucket === testYear.toString()
        );

        if (!locationItemLog) {
          continue;
        }
        sortedLogs = locationItemLog.locationBucketLog.sort(
          (a, b) => b.updateDate - a.updateDate
        );
        if (sortedLogs.length > 0) {
          // Return the most recent updateDate
          return res
            .status(200)
            .json({ outputList: [sortedLogs[0].updateDate] });
        }
        // Else go check the next year
      }
      throw new Error('Location not found in item log within the past 5 years');
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.body.itemName
  async getTotalLocationCount(req, res) {
    try {
      const businessId = req.query.businessId;
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      let { itemName, locationName } = req.body;
      // Find the business by its ID
      const business = await Business.findById(businessId).populate(
        'itemList.locationItemList.inventoryList'
      );

      if (!business) {
        throw new Error('Business not found');
      }

      // Find the specific item in the business's itemList based on the given itemName
      const item = business.itemList.find(item => item.itemName === itemName);

      if (!item) {
        throw new Error('Item not found in the specified business');
      }
      console.log('Location Name:', locationName);
      console.log('Location Item List:', item.locationItemList);

      const locationItem = item.locationItemList.find(
        location => location.locationName === locationName
      );

      if (!locationItem) {
        throw new Error('locationItem not found in the specified item');
      }

      // Calculate the sum of all portionNumber in the inventoryList
      let sum = 0;

      locationItem.inventoryList.forEach(inventory => {
        sum += inventory.portionNumber;
      });

      //req.query.printedFieldName
      return res.status(200).json({ outputList: [sum] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
let itemLocationController = new ItemLocationController();
module.exports = {
  createItemLocation: (req, res) =>
    itemLocationController.createItemLocation(req, res),
  readAllItemLocationName: (req, res) =>
    itemLocationController.readAllItemLocationName(req, res),
  readOneItemLocation: (req, res) =>
    itemLocationController.readOneItemLocation(req, res),
  updateItemLocationName: (req, res) =>
    itemLocationController.updateItemLocationName(req, res),
  deleteItemLocation: (req, res) =>
    itemLocationController.deleteItemLocation(req, res),
  getOneRecentDate: (req, res) =>
    itemLocationController.getOneRecentDate(req, res),
  getTotalLocationCount: (req, res) =>
    itemLocationController.getTotalLocationCount(req, res)
};
