// Rename to business_operations.js?
const { Business, Item } = require('../../models/business_model');
const GenericCRUDController = require('./generic_crud_controller');

const mongoose = require('mongoose');

class ItemRelationController extends GenericCRUDController {
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

  async doesExistRelation(businessId, rawItemName, finishedItemName) {
    try {
      const rawUsedInList = await Business.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(businessId) } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': rawItemName } },
        { $project: { usedInList: '$itemList.usedInList' } },
        { $unwind: '$usedInList' },
        { $match: { 'usedInList.itemName': finishedItemName } },
        { $project: { itemName: '$usedInList.itemName' } }
      ]);
      // // console.log(rawUsedInList);
      if (rawUsedInList.length === 0) {
        // console.log(
        //   `Raw ${rawItemName} not found item Finishd '${finishedItemName}' in usedInList`
        // );
      } else {
        // console.log(
        //   `Raw ${rawItemName} found item Finishd '${finishedItemName}' in usedInList`
        // );
        return false;
      }
      const rawItemNeededList = await Business.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(businessId) } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': rawItemName } },
        { $project: { itemNeededList: '$itemList.itemNeededList' } },
        { $unwind: '$itemNeededList' },
        { $match: { 'itemNeededList.itemName': finishedItemName } },
        { $project: { itemName: '$itemNeededList.itemName' } }
      ]);
      // console.log(rawItemNeededList);
      if (rawItemNeededList.length === 0) {
        // console.log(
        //   `Raw ${rawItemName} not found item Finishd '${finishedItemName}' in itemNeededList`
        // );
      } else {
        // console.log(
        //   `Raw ${rawItemName} found item Finishd '${finishedItemName}' in itemNeededList`
        // );
        return false;
      }

      return true;
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  //req.query.businessId  req.body.rawItemName req.body.finishedItemName req.body.unitCost
  async createRelation(req, res) {
    const businessId = req.query.businessId;
    const { rawItemName, finishedItemName, unitCost } = req.body;

    try {
      // console.log('Check if Both Items Exist');
      let doesExistRaw = await this.doesExistItem(
        businessId,
        'itemList.itemName',
        rawItemName
      );
      if (!doesExistRaw) {
        // console.log(`Raw Item Doesn't Exist`);
        return res.status(409).json({ error: `Raw Item Doesn't Exist` });
      }
      let doesExistFinished = await this.doesExistItem(
        businessId,
        'itemList.itemName',
        finishedItemName
      );
      if (!doesExistFinished) {
        // console.log(`Finished Item Doesn't Exist`);
        return res.status(409).json({ error: `Finished Item Doesn't Exist` });
      }
      let doesConnectionExist = await this.doesExistRelation(
        businessId,
        rawItemName,
        finishedItemName
      );
      if (!doesConnectionExist) {
        // console.log('Item Connection has already been made');
        return res
          .status(409)
          .json({ error: 'Item Connection has already been made' });
      }

      // console.log('About to create relation');
      const rawUsedInData = { itemName: finishedItemName, unitCost: unitCost };
      const statusDataRaw = await super.createGenericByQuery(
        {
          _id: businessId,
          'itemList.itemName': rawItemName
        },
        { $push: { 'itemList.$.usedInList': rawUsedInData } }
      );

      const finishedNeededData = { itemName: rawItemName, unitCost: unitCost };
      const statusDataFinished = await super.createGenericByQuery(
        {
          _id: businessId,
          'itemList.itemName': finishedItemName
        },
        { $push: { 'itemList.$.itemNeededList': finishedNeededData } }
      );
      // Fetch the updated business document
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Find the raw item in the business document
      const rawItem = business.itemList.find(
        item => item.itemName === rawItemName
      );
      if (rawItem) {
        // Sort the usedInList by itemName in ascending order
        rawItem.usedInList.sort((a, b) => a.itemName.localeCompare(b.itemName));
      }

      // Find the finished item in the business document
      const finishedItem = business.itemList.find(
        item => item.itemName === finishedItemName
      );
      if (finishedItem) {
        // Sort the itemNeededList by itemName in ascending order
        finishedItem.itemNeededList.sort((a, b) =>
          a.itemName.localeCompare(b.itemName)
        );
      }

      // Save the updated business document
      await business.save();
      return res
        .status(200)
        .json({ statusDetails: [statusDataRaw, statusDataFinished] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId
  async readAllItemUsedIn(req, res) {
    try {
      const businessId = req.query.businessId;
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      let { itemName } = req.body;
      // // console.log(itemName);
      // { $limit: outputSize }, // Project only the name field for each post
      // { $skip: outset } // Project only the name field for each post
      // console.log('About to read');
      const fieldValues = await super.readGeneric([
        { $match: { _id: mongooseBusinessID } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': itemName } },
        { $project: { _id: 0, usedInList: '$itemList.usedInList' } }
      ]);

      //req.query.printedFieldName
      return res.status(200).json({ outputList: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId
  async readAllItemNeeded(req, res) {
    try {
      const businessId = req.query.businessId;
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      let { itemName } = req.body;
      // // console.log(itemName);
      // { $limit: outputSize }, // Project only the name field for each post
      // { $skip: outset } // Project only the name field for each post
      // console.log('About to read');
      const fieldValues = await super.readGeneric([
        { $match: { _id: mongooseBusinessID } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': itemName } },
        { $project: { _id: 0, itemNeededList: '$itemList.itemNeededList' } }
      ]);

      //req.query.printedFieldName
      return res.status(200).json({ outputList: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.body.rawItemName   req.body.finishedItemName req.body.newUnitCost
  // NOT DOES NOT UPDATE ItemNeeded ItemUsed YET
  async updateItemRelationUnitCost(req, res) {
    const { rawItemName, finishedItemName, newUnitCost } = req.body;
    const businessId = req.query.businessId;
    try {
      // console.log('About to update Raw Items Used In List');
      const statusDataRaw = await super.updateGeneric(
        {
          _id: businessId,
          'itemList.itemName': rawItemName,
          'itemList.usedInList.itemName': finishedItemName
        },
        {
          $set: {
            'itemList.$[item].usedInList.$[usedIn].unitCost': newUnitCost
          }
        },
        {
          arrayFilters: [
            { 'item.itemName': rawItemName }, // Filter for the correct item
            { 'usedIn.itemName': finishedItemName } // Filter for the correct portion info
          ]
        }
      );
      // console.log(statusDataRaw);

      // console.log('About to update Finished Items Needed List');
      const statusDataFinished = await super.updateGeneric(
        {
          _id: businessId,
          'itemList.itemName': finishedItemName,
          'itemList.itemNeededList.itemName': rawItemName
        },
        {
          $set: {
            'itemList.$[item].itemNeededList.$[needed].unitCost': newUnitCost
          }
        },
        {
          arrayFilters: [
            { 'item.itemName': finishedItemName }, // Filter for the correct item
            { 'needed.itemName': rawItemName } // Filter for the correct portion info
          ]
        }
      );
      return res
        .status(200)
        .json({ outputList: [statusDataRaw, statusDataFinished] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.body.rawItemName req.body.finishedItemName
  async deleteRelation(req, res) {
    const businessId = req.query.businessId;
    const { rawItemName, finishedItemName } = req.body;
    try {
      // console.log('About to delete Raws Used In Connection');
      const statusDataRaw = await super.deleteGenericByQuery(
        {
          _id: businessId,
          'itemList.itemName': rawItemName,
          'itemList.usedInList.itemName': finishedItemName
        },
        {
          $pull: {
            'itemList.$.usedInList': { itemName: finishedItemName }
          }
        }
      );

      // console.log('About to delete Finished Needed In Connection');
      const statusDataFinished = await super.deleteGenericByQuery(
        {
          _id: businessId,
          'itemList.itemName': finishedItemName,
          'itemList.itemNeededList.itemName': rawItemName
        },
        {
          $pull: {
            'itemList.$.itemNeededList': { itemName: rawItemName }
          }
        }
      );
      return res
        .status(200)
        .json({ statusDetails: [statusDataRaw, statusDataFinished] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
let itemRelationController = new ItemRelationController();
module.exports = {
  createRelation: (req, res) => itemRelationController.createRelation(req, res),
  readAllItemUsedIn: (req, res) =>
    itemRelationController.readAllItemUsedIn(req, res),
  readAllItemNeeded: (req, res) =>
    itemRelationController.readAllItemNeeded(req, res),
  updateItemRelationUnitCost: (req, res) =>
    itemRelationController.updateItemRelationUnitCost(req, res),
  deleteRelation: (req, res) => itemRelationController.deleteRelation(req, res)
};
