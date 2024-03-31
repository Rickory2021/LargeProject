// Rename to business_operations.js?
const { Item } = require('../../models/business_model');
const GenericCRUDController = require('../crud/generic_crud_controller');

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

  //req.query.businessId  req.query.printedFieldNameList [Recurring for List]
  async createItem(req, res) {
    let businessId = req.query.businessId;
    let itemName = req.query.itemName;

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
      return res.status(200).json({ status: statusData });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.query.printedFieldNameList [Recurring for List]
  async readItem(req, res) {
    try {
      console.log('About to read');
      let mongooseObjectID = new mongoose.Types.ObjectId(req.query.businessId);
      // { $limit: outputSize }, // Project only the name field for each post
      // { $skip: outset } // Project only the name field for each post
      const fieldValues = await super.readGeneric([
        {
          $match: {
            _id: mongooseObjectID
          }
        },
        { $unwind: `$itemList` },
        {
          $match: {
            'itemList.itemName': 'Fluid Item'
          }
        },
        {
          $project: {
            itemName: '$itemList',
            _id: 1
          }
        }
      ]);
      //req.query.printedFieldName
      return res.status(200).json({ list: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.query.printedFieldNameList [Recurring for List]
  async updateItem(req, res) {
    try {
      console.log('About to update');
      // { $limit: outputSize }, // Project only the name field for each post
      // { $skip: outset } // Project only the name field for each post
      const fieldValues = await super.updateGeneric(
        {
          _id: req.query.businessId,
          'itemList.itemName': 'Fluidy Item'
        },
        {
          $set: { 'itemList.$.itemName': 'Fluid Item' }
        }
      );
      //req.query.printedFieldName
      return res.status(200).json({ list: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.query.printedFieldNameList [Recurring for List]
  async deleteItem(req, res) {
    try {
      console.log('About to delete');
      // { $limit: outputSize }, // Project only the name field for each post
      // { $skip: outset } // Project only the name field for each post
      const fieldValues = await super.deleteGeneric(
        req.query.businessId,
        'itemList',
        'itemName',
        'newItem'
      );
      //req.query.printedFieldName
      return res.status(200).json({ list: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
let itemListController = new ItemListController();
module.exports = {
  createItem: (req, res) => itemListController.createItem(req, res),
  readItem: (req, res) => itemListController.readItem(req, res),
  updateItem: (req, res) => itemListController.updateItem(req, res),
  deleteItem: (req, res) => itemListController.deleteItem(req, res)
};
