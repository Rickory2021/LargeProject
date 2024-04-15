// Rename to business_operations.js?
const { Business, Item } = require('../../models/business_model');
const GenericCRUDController = require('./generic_crud_controller');

const mongoose = require('mongoose');

class EstimateDeductionController extends GenericCRUDController {
  constructor() {
    super();
  }
  //req.query.businessId
  async readEstimateDeduction(req, res) {
    console.log('readEstimateDeduction');
    try {
      const businessId = req.query.businessId;
      let { itemName } = req.body;
      console.log('About to read');
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      // { $limit: outputSize }, // Project only the name field for each post
      // { $skip: outset } // Project only the name field for each post
      const fieldValues = await super.readGeneric([
        { $match: { _id: mongooseBusinessID } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': itemName } },
        {
          $project: {
            _id: 0,
            estimateDeduction: '$itemList.estimateDeduction'
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
  async updateEstimateDeduction(req, res) {
    const { newEstimateDeduction, findItemName } = req.body;
    const businessId = req.query.businessId;
    try {
      console.log('About to update');
      const statusDetails = await super.updateGeneric(
        {
          _id: businessId,
          'itemList.itemName': findItemName
        },
        { $set: { 'itemList.$.estimateDeduction': newEstimateDeduction } }
      );
      return res.status(200).json({ statusDetails: [statusDetails] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
let estimateDeductionController = new EstimateDeductionController();
module.exports = {
  readEstimateDeduction: (req, res) =>
    estimateDeductionController.readEstimateDeduction(req, res),
  updateEstimateDeduction: (req, res) =>
    estimateDeductionController.updateEstimateDeduction(req, res)
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
