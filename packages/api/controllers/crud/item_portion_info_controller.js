// Rename to business_operations.js?
const { PortionInfo } = require('../../models/business_model');
const GenericCRUDController = require('./generic_crud_controller');
const { Business } = require('../../models/business_model');

const mongoose = require('mongoose');

class PortionInfoListController extends GenericCRUDController {
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

  async doesExistUnitName(businessId, itemName, unitName) {
    try {
      const portionInfo = await Business.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(businessId) } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': itemName } },
        { $project: { portionInfoList: '$itemList.portionInfoList' } },
        { $unwind: '$portionInfoList' },
        { $match: { 'portionInfoList.unitName': unitName } },
        { $project: { unitName: '$portionInfoList.unitName' } }
      ]);
      // // console.log(portionInfo);
      if (portionInfo.length === 0) {
        // console.log(
        //   `UnitName '${unitName}' not found for item '${itemName}' in business '${businessId}'`
        // );
        return false;
      } else {
        // console.log(
        //   `UnitName '${unitName}' found for item '${itemName}' in business '${businessId}'`
        // );
        return true;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  //req.query.businessId  req.query.itemName req.body.unitName req.body.unitNumber
  async createPortionInfo(req, res) {
    let businessId = req.query.businessId;
    let { itemName, unitName, unitNumber } = req.body;
    // console.log(
    //   `businessId:${businessId} itemName :${itemName} unitName :${unitName} unitNumber :${unitNumber}`
    // );

    try {
      // console.log('Check if Duplicate ItemName');
      let doesExist = await this.doesExistUnitName(
        businessId,
        itemName,
        unitName
      );
      if (doesExist) {
        // console.log('DUPLICATE of New UnitName found in item');
        return res
          .status(409)
          .json({ error: 'DUPLICATE New UnitName found in item' });
      }
      // console.log('About to create');
      const newPortionInfoObject = new PortionInfo({
        unitName: unitName,
        unitNumber: unitNumber
      });
      const statusData = await super.createGenericByQuery(
        {
          _id: businessId,
          'itemList.itemName': itemName
        },
        {
          $push: {
            'itemList.$.portionInfoList': newPortionInfoObject
          }
        }
      );

      // Fetch the updated business document
      const business = await Business.findById(businessId);

      // Find the item with the given itemName
      const item = business.itemList.find(item => item.itemName === itemName);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      // Sort the portionInfoList array by portionNumber in ascending order
      item.portionInfoList.sort((a, b) => a.unitNumber - b.unitNumber);

      // Save the updated business document
      await business.save();
      //req.query.printedFieldName
      return res.status(200).json({ statusDetails: [statusData] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.query.printedFieldNameList [Recurring for List]
  async readAllPortionInfo(req, res) {
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
        { $project: { _id: 0, portionInfoList: '$itemList.portionInfoList' } }
      ]);

      //req.query.printedFieldName
      return res.status(200).json({ outputList: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName, findUnitName, newUnitName }
  // NOT DOES NOT UPDATE ItemNeeded ItemUsed YET
  async updatePortionInfoName(req, res) {
    const { itemName, findUnitName, newUnitName } = req.body;
    const businessId = req.query.businessId;
    try {
      // console.log('Check if Duplicate ItemName');
      let doesExist = await this.doesExistUnitName(
        businessId,
        itemName,
        newUnitName
      );
      if (doesExist) {
        // console.log('DUPLICATE of New UnitName found in item');
        return res
          .status(409)
          .json({ error: 'DUPLICATE New UnitName found in item' });
      }
      // console.log('About to update');
      const statusDetails = await super.updateGeneric(
        {
          _id: businessId,
          'itemList.itemName': itemName,
          'itemList.portionInfoList.unitName': findUnitName
        },
        {
          $set: {
            'itemList.$[item].portionInfoList.$[portion].unitName': newUnitName
          }
        },
        {
          arrayFilters: [
            { 'item.itemName': itemName }, // Filter for the correct item
            { 'portion.unitName': findUnitName } // Filter for the correct portion info
          ]
        }
      );
      return res.status(200).json({ statusDetails: [statusDetails] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId { itemName, findUnitName, newUnitNumber }
  // NOT DOES NOT UPDATE ItemNeeded ItemUsed YET
  async updatePortionInfoNumber(req, res) {
    const { itemName, findUnitName, newUnitNumber } = req.body;
    const businessId = req.query.businessId;
    try {
      // console.log('About to update');
      const statusDetails = await super.updateGeneric(
        {
          _id: businessId,
          'itemList.itemName': itemName,
          'itemList.portionInfoList.unitName': findUnitName
        },
        {
          $set: {
            'itemList.$[item].portionInfoList.$[portion].unitNumber':
              newUnitNumber
          }
        },
        {
          arrayFilters: [
            { 'item.itemName': itemName }, // Filter for the correct item
            { 'portion.unitName': findUnitName } // Filter for the correct portion info
          ]
        }
      );
      // Fetch the updated business document after the update
      const updatedBusiness = await Business.findById(businessId);
      if (!updatedBusiness) {
        throw new Error('Business not found');
      }

      // Find the specific item
      const item = updatedBusiness.itemList.find(
        item => item.itemName === itemName
      );
      if (!item) {
        throw new Error('Item not found');
      }

      // Sort the portionInfoList array by unitNumber in ascending order
      item.portionInfoList.sort((a, b) => a.unitNumber - b.unitNumber);

      // Save the changes back to the database
      await updatedBusiness.save();
      return res.status(200).json({ statusDetails: [statusDetails] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName, unitName }
  async deletePortionInfo(req, res) {
    const businessId = req.query.businessId;
    const { itemName, unitName } = req.body;
    try {
      const statusData = await super.deleteGenericByQuery(
        {
          _id: businessId,
          'itemList.itemName': itemName,
          'itemList.portionInfoList.unitName': unitName
        },
        {
          $pull: {
            'itemList.$.portionInfoList': { unitName: unitName }
          }
        }
      );
      return res.status(200).json({ statusDetails: [statusData] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
let portionInfoListController = new PortionInfoListController();
module.exports = {
  createPortionInfo: (req, res) =>
    portionInfoListController.createPortionInfo(req, res),
  readAllPortionInfo: (req, res) =>
    portionInfoListController.readAllPortionInfo(req, res),
  updatePortionInfoName: (req, res) =>
    portionInfoListController.updatePortionInfoName(req, res),
  updatePortionInfoNumber: (req, res) =>
    portionInfoListController.updatePortionInfoNumber(req, res),
  deletePortionInfo: (req, res) =>
    portionInfoListController.deletePortionInfo(req, res)
};
