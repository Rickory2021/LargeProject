const { DistributorMetaData } = require('../../models/business_model');
const GenericCRUDController = require('../crud/generic_crud_controller');

const mongoose = require('mongoose');

class DistributorMetaDataController extends GenericCRUDController {
  constructor() {
    super();
  }

  async addDistributorMetaData(req, res) {
    try {
      const businessId = req.query.businessId;

      const distributorMetaData = {
        distributorName: req.body.distributorName,
        distributorDeadlineDate: req.body.distributorDeadlineDate,
        distributorDeliveryDate: req.body.distributorDeliveryDate,
        distributorMetaData: req.body.distributorMetaData
      };

      const result = await super.createGeneric(
        businessId,
        'distributorMetaDataList',
        DistributorMetaData,
        distributorMetaData
      );

      if (result && result.modifiedCount > 0) {
        return res.status(200).json({ message: distributorMetaData });
      } else {
        return res
          .status(400)
          .json({ message: 'Failed to add distributor metadata' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async readDistributorMetaData(req, res) {
    try {
      let businessId = new mongoose.Types.ObjectId(req.query.businessId);
  
      const distributorMetaData = await super.readGeneric([
        {
          $match: { _id: businessId }
        },
        {
          $project: {
            distributorMetaDataList: 1,
            _id: 0
          }
        }
      ]);
    
      if (!distributorMetaData || distributorMetaData.length === 0) {
        return res.status(404).json({
          message: 'No distributor metadata found for the given business ID'
        });
      }
      
      return res.status(200).json({
        distributorMetaDataList: distributorMetaData[0]?.distributorMetaDataList || []
      });
  
    } catch (error) {
      console.error('Error reading distributor metadata:', error);
      return res.status(500).json({ error: error.message });
    }
  }  
}

let distributorMetadataListController = new DistributorMetaDataController();
module.exports = {
  addDistributorMetaData: (req, res) =>
    distributorMetadataListController.addDistributorMetaData(req, res),
  readDistributorMetaData: (req, res) =>
    distributorMetadataListController.readDistributorMetaData(req, res)
};
