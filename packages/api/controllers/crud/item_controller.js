// Rename to business_operations.js?
const { Business, Item } = require('../../models/business_model');
const GenericCRUDController = require('./generic_crud_controller');

const mongoose = require('mongoose');

class ItemListController extends GenericCRUDController {
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

  //req.query.businessId  req.body.itemName
  async createItem(req, res) {
    const businessId = req.query.businessId;
    const { itemName } = req.body;

    try {
      console.log('Check if Duplicate ItemName');
      let doesExist = await this.doesExistItem(
        businessId,
        'itemList.itemName',
        itemName
      );
      if (doesExist) {
        console.log('DUPLICATE ItemName found in itemList');
        return res
          .status(409)
          .json({ error: 'DUPLICATE ItemName found in itemList' });
      }

      console.log('About to create');
      const statusData = await super.createGeneric(
        businessId,
        'itemList',
        Item,
        { itemName: itemName }
      );

      // After adding the item, fetch the updated business document
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Sort the itemList array by itemName
      business.itemList.sort((a, b) => a.itemName.localeCompare(b.itemName));

      // Save the updated business document
      await business.save();

      // Return the status details
      return res.status(200).json({ statusDetails: [statusData] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId
  async readAllItemName(req, res) {
    try {
      const businessId = req.query.businessId;
      console.log('About to read');
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      // { $limit: outputSize }, // Project only the name field for each post
      // { $skip: outset } // Project only the name field for each post
      const fieldValues = await super.readGeneric([
        { $match: { _id: mongooseBusinessID } },
        { $unwind: `$itemList` },
        { $project: { _id: 0, itemName: '$itemList.itemName' } }
      ]);
      // After adding the item, fetch the updated business document
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Sort the itemList array by itemName
      business.itemList.sort((a, b) => a.itemName.localeCompare(b.itemName));

      // Save the updated business document
      await business.save();
      //req.query.printedFieldName
      return res.status(200).json({ output: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId {itemName}
  async readOneItem(req, res) {
    try {
      console.log('About to read');
      const mongooseBusinessID = new mongoose.Types.ObjectId(
        req.query.businessId
      );
      const { itemName } = req.body;
      // { $limit: outputSize }, // Project only the name field for each post
      // { $skip: outset } // Project only the name field for each post
      const fieldValues = await super.readGeneric([
        { $match: { _id: mongooseBusinessID } },
        {
          $project: {
            _id: 0,
            item: {
              $filter: {
                input: '$itemList', // Use itemList as input
                as: 'item',
                cond: { $eq: ['$$item.itemName', itemName] }
              }
            }
          }
        }
      ]);
      //req.query.printedFieldName
      return res.status(200).json({ output: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.body.newItemName   req.body.findItemName
  // NOT DOES NOT UPDATE ItemNeeded ItemUsed YET
  async updateItemName(req, res) {
    const { newItemName, findItemName } = req.body;
    const businessId = req.query.businessId;
    try {
      console.log('Check if Duplicate ItemName');
      let doesExist = await this.doesExistItem(
        businessId,
        'itemList.itemName',
        newItemName
      );
      if (doesExist) {
        console.log('DUPLICATE of New ItemName found in itemList');
        return res
          .status(409)
          .json({ error: 'DUPLICATE New ItemName found in itemList' });
      }
      console.log('About to update');
      const statusDetails = await super.updateGeneric(
        {
          _id: businessId,
          'itemList.itemName': findItemName
        },
        { $set: { 'itemList.$.itemName': newItemName } }
      );
      return res.status(200).json({ statusDetails: [statusDetails] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.body.itemName
  async deleteItem(req, res) {
    const businessId = req.query.businessId;
    const { itemName } = req.body;
    try {
      console.log('About to delete');
      const statusData = await super.deleteGeneric(
        businessId,
        'itemList',
        'itemName',
        itemName
      );
      return res.status(200).json({ statusDetails: [statusData] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  //req.query.businessId  req.body.itemName
  async getTotalItemCount(req, res) {
    try {
      const businessId = req.query.businessId;
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      let { itemName } = req.body;
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

      // Calculate the sum of all portionNumber in the inventoryList
      let sum = 0;
      item.locationItemList.forEach(locationItem => {
        locationItem.inventoryList.forEach(inventory => {
          sum += inventory.portionNumber;
        });
      });

      //req.query.printedFieldName
      return res.status(200).json({ outputList: [sum] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
let itemListController = new ItemListController();
module.exports = {
  createItem: (req, res) => itemListController.createItem(req, res),
  readAllItemName: (req, res) => itemListController.readAllItemName(req, res),
  readOneItem: (req, res) => itemListController.readOneItem(req, res),
  updateItemName: (req, res) => itemListController.updateItemName(req, res),
  deleteItem: (req, res) => itemListController.deleteItem(req, res),
  getTotalItemCount: (req, res) =>
    itemListController.getTotalItemCount(req, res)
};
