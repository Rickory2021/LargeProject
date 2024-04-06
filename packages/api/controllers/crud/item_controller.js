// Rename to business_operations.js?
const { Item } = require('../../models/business_model');
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
      //req.query.printedFieldName
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
}
let itemListController = new ItemListController();
module.exports = {
  createItem: (req, res) => itemListController.createItem(req, res),
  readAllItemName: (req, res) => itemListController.readAllItemName(req, res),
  readOneItem: (req, res) => itemListController.readOneItem(req, res),
  updateItemName: (req, res) => itemListController.updateItemName(req, res),
  deleteItem: (req, res) => itemListController.deleteItem(req, res)
};

// let mongooseBusinessID = new mongoose.Types.ObjectId(
//   req.query.businessId
// );
// // { $limit: outputSize }, // Project only the name field for each post
// // { $skip: outset } // Project only the name field for each post
// let index = await super.readGeneric([
//   { $match: { _id: mongooseBusinessID } },
//   {
//     $project: {
//       _id: 0,
//       index: {
//         $indexOfArray: ['$itemList.itemName', req.query.itemName] // Get the index of matched itemName
//       }
//     }
//   }
// ]);
// if (index.length === 0)
//   return res.status(400).json({ error: 'No Item Found' });
// console.log(index);
// const value = index[0].index;
