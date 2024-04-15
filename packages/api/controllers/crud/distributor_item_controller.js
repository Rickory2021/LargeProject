// Rename to business_operations.js?
const {
  DistributorItem,
  DistributorMetaData
} = require('../../models/business_model');
const GenericCRUDController = require('./generic_crud_controller');
const { Business, LocationMetaData } = require('../../models/business_model');

const mongoose = require('mongoose');

class DistributorItemController extends GenericCRUDController {
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

  async doesExistDistributorName(businessId, itemName, distributorName) {
    try {
      const locationInfo = await Business.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(businessId) } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': itemName } },
        {
          $project: {
            distributorItemList: '$itemList.distributorItemController'
          }
        },
        { $unwind: '$distributorItemList' },
        { $match: { 'distributorItemList.distributorName': distributorName } },
        {
          $project: { distributorName: '$distributorItemList.distributorName' }
        }
      ]);
      console.log(locationInfo);
      if (locationInfo.length === 0) {
        console.log(
          `distributorName '${distributorName}' not found for item '${itemName}' in business '${businessId}'`
        );
        return false;
      } else {
        console.log(
          `distributorName '${distributorName}' found for item '${itemName}' in business '${businessId}'`
        );
        return true;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  async doesExistDistributorMetaData(businessId, distributorName) {
    try {
      const distributorMetaData = await this.doesExistGeneric(
        businessId,
        'distributorMetaDataList.distributorName',
        distributorName
      );
      console.log(distributorMetaData);
      if (distributorMetaData.length === 0) {
        console.log(
          `distributorMetaData '${distributorName}' not found in business '${businessId}'`
        );
        return false;
      } else {
        console.log(
          `distributorMetaData '${distributorName}' found for in business '${businessId}'`
        );
        return true;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  //req.query.businessId  {itemName, distributorName, distributorItemName, distributorItemPortion, distributorItemCost, priorityChoice}
  async createDistributorItem(req, res) {
    let businessId = req.query.businessId;
    let {
      itemName,
      distributorName,
      distributorItemName,
      distributorItemPortion,
      distributorItemCost,
      priorityChoice
    } = req.body;
    console.log(
      `businessId:${businessId} itemName :${itemName} distributorName :${distributorName} distributorItemName :${distributorItemName} \n
      distributorItemPortion :${distributorItemPortion} distributorItemCost :${distributorItemCost} priorityChoice :${priorityChoice}`
    );
    let createDistributorItemStatus, createDistributorMetadataStatus;
    const newDistributorObject = new DistributorItem({
      itemName: itemName,
      distributorName: distributorName,
      distributorItemName: distributorItemName,
      distributorItemPortion: distributorItemPortion,
      distributorItemCost: distributorItemCost,
      priorityChoice: priorityChoice
    });
    try {
      // Note that there can be multiple products from the same distributor
      console.log('About to create');
      createDistributorItemStatus = await super.createGenericByQuery(
        {
          _id: businessId,
          'itemList.itemName': itemName
        },
        {
          $push: { 'itemList.$.distributorItemList': newDistributorObject }
        }
      );

      // Fetch the updated business document
      const business = await Business.findById(businessId);
      // Find the item within the business document
      const item = business.itemList.find(item => item.itemName === itemName);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      // Sort the distributorItemList by priorityChoice
      item.distributorItemList.sort(
        (a, b) => a.priorityChoice - b.priorityChoice
      );

      // Save the updated business document
      await business.save();

      // Check MetaData
      try {
        // Need locationName to check if the document exists
        const exists = await this.doesExistGeneric(
          businessId,
          'distributorMetaDataList.distributorName',
          distributorName
        );

        if (exists) {
          return res
            .status(400)
            .json({ statusDetails: [createDistributorItemStatus] });
        }

        const distributorMetaDataObject = {
          distributorName: distributorName,
          distributorDeadlineDate: '',
          distributorDeliveryDate: '',
          distributorMetaData: ''
        };

        // TODO: Does not account for white space or case
        createDistributorMetadataStatus = await super.createGeneric(
          businessId,
          'distributorMetaDataList',
          DistributorMetaData,
          distributorMetaDataObject
        );

        if (
          createDistributorMetadataStatus &&
          createDistributorMetadataStatus.modifiedCount > 0
        ) {
          return res.status(200).json({
            statusDetails: [
              createDistributorItemStatus,
              createDistributorMetadataStatus
            ]
          });
        } else {
          return res.status(400).json({
            statusDetails: [
              createDistributorItemStatus,
              createDistributorMetadataStatus
            ]
          });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ createDistributorItemStatus, error: error.message });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName }
  async readAllDisributorItem(req, res) {
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
            distributorItemList: '$itemList.distributorItemList'
          }
        }
      ]);

      //req.query.printedFieldName
      return res.status(200).json({ outputList: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName, index, newDistributorItemName }
  async updateDistributorItemName(req, res) {
    const { itemName, index, newDistributorItemName } = req.body;
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
      // Update the portionNumber at the specified index
      if (index >= 0 && index < item.distributorItemList.length) {
        item.distributorItemList[index].distributorItemName =
          newDistributorItemName;
      } else {
        console.log('Invalid index');
        return res.status(500).json({ error: 'Invalid index' });
      }
      const statusDetails = await business.save();
      console.log(`Distributor's ItemName updated successfully`);
      return res.status(200).json({
        statusDetails: [
          {
            acknowledged: true,
            modifiedCount: 1,
            upsertedId: null,
            upsertedCount: 0,
            matchedCount: 1
          }
        ]
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName, index, newItemPortion }
  async updateDistributorItemPortion(req, res) {
    const { itemName, index, newItemPortion } = req.body;
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
      // Update the portionNumber at the specified index
      if (index >= 0 && index < item.distributorItemList.length) {
        item.distributorItemList[index].distributorItemPortion = newItemPortion;
      } else {
        console.log('Invalid index');
        return res.status(500).json({ error: 'Invalid index' });
      }
      const statusDetails = await business.save();
      console.log(`Distributor's ItemPortion updated successfully`);
      return res.status(200).json({
        statusDetails: [
          {
            acknowledged: true,
            modifiedCount: 1,
            upsertedId: null,
            upsertedCount: 0,
            matchedCount: 1
          }
        ]
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName, index, newItemCost }
  async updateDistributorItemCost(req, res) {
    const { itemName, index, newItemCost } = req.body;
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
      // Update the portionNumber at the specified index
      if (index >= 0 && index < item.distributorItemList.length) {
        item.distributorItemList[index].distributorItemCost = newItemCost;
      } else {
        console.log('Invalid index');
        return res.status(500).json({ error: 'Invalid index' });
      }
      const statusDetails = await business.save();
      console.log(`Distributor's ItemCost updated successfully`);
      return res.status(200).json({
        statusDetails: [
          {
            acknowledged: true,
            modifiedCount: 1,
            upsertedId: null,
            upsertedCount: 0,
            matchedCount: 1
          }
        ]
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName, index, newPriorityChoice }
  async updateDistributorItemPriorityChoice(req, res) {
    const { itemName, index, newPriorityChoice } = req.body;
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
      // Update the portionNumber at the specified index
      if (index >= 0 && index < item.distributorItemList.length) {
        item.distributorItemList[index].priorityChoice = newPriorityChoice;
      } else {
        console.log('Invalid index');
        return res.status(500).json({ error: 'Invalid index' });
      }
      // Sort the distributorItemList by priorityChoice
      item.distributorItemList.sort(
        (a, b) => a.priorityChoice - b.priorityChoice
      );

      // Save the updated business document
      await business.save();
      const statusDetails = await business.save();
      console.log(`Distributor Item's Priority Choice updated successfully`);
      return res.status(200).json({
        statusDetails: [
          {
            acknowledged: true,
            modifiedCount: 1,
            upsertedId: null,
            upsertedCount: 0,
            matchedCount: 1
          }
        ]
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId { itemName, index }
  async deleteDistributorItem(req, res) {
    const businessId = req.query.businessId;
    const { itemName, index } = req.body;
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

      // Delete the element at the specified index
      if (index >= 0 && index < item.distributorItemList.length) {
        item.distributorItemList.splice(index, 1);
      } else {
        console.log('Invalid index');
        return res.status(500).json({ error: 'Invalid index' });
      }

      // Save the changes to the database
      const statusData = await business.save();
      console.log('Distributor item deleted successfully');
      return res.status(200).json({
        statusDetails: [
          {
            acknowledged: true,
            modifiedCount: 1,
            upsertedId: null,
            upsertedCount: 0,
            matchedCount: 1
          }
        ]
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
let distributorItemController = new DistributorItemController();
module.exports = {
  createDistributorItem: (req, res) =>
    distributorItemController.createDistributorItem(req, res),
  readAllDisributorItem: (req, res) =>
    distributorItemController.readAllDisributorItem(req, res),
  updateDistributorItemName: (req, res) =>
    distributorItemController.updateDistributorItemName(req, res),
  updateDistributorItemPortion: (req, res) =>
    distributorItemController.updateDistributorItemPortion(req, res),
  updateDistributorItemCost: (req, res) =>
    distributorItemController.updateDistributorItemCost(req, res),
  updateDistributorItemPriorityChoice: (req, res) =>
    distributorItemController.updateDistributorItemPriorityChoice(req, res),
  deleteDistributorItem: (req, res) =>
    distributorItemController.deleteDistributorItem(req, res)
};
