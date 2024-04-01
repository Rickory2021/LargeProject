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
        distributorMetaDataList:
          distributorMetaData[0]?.distributorMetaDataList || []
      });
    } catch (error) {
      console.error('Error reading distributor metadata:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // TODO: error checking
  async updateDistributorMetaData(req, res) {
    try {
      const { businessId, distributorName } = req.query;

      const filterJson = {
        _id: businessId,
        'distributorMetaDataList.distributorName': distributorName
      };

      // Uncomment first line if the name can be changes
      const updateJson = {
        $set: {
          // 'distributorMetaDataList.$.distributorName': req.body.distributorName,
          'distributorMetaDataList.$.distributorDeadlineDate':
            req.body.distributorDeadlineDate,
          'distributorMetaDataList.$.distributorDeliveryDate':
            req.body.distributorDeliveryDate,
          'distributorMetaDataList.$.distributorMetaData':
            req.body.distributorMetaData
        }
      };

      const result = await super.updateGeneric(filterJson, updateJson);

      return res.status(200).json({ message: result }); // The result is printed but its the changed values
    } catch (error) {
      console.error('Error updating distributor metadata:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteDistributorMetaData(req, res) {
    try {
      const businessId = req.query.businessId;
      const distributorName = req.query.distributorName;

      if (!businessId || !distributorName) {
        return res.status(400).json({
          message: 'Missing businessId or distributorName in the request.'
        });
      }

      const objectId = new mongoose.Types.ObjectId(businessId);

      const result = await this.deleteGeneric(
        objectId,
        'distributorMetaDataList',
        'distributorName',
        distributorName
      );

      return res.status(200).json({ message: result });
    } catch (error) {
      console.error('Error deleting distributor metadata:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

let distributorMetadataListController = new DistributorMetaDataController();
module.exports = {
  addDistributorMetaData: (req, res) =>
    distributorMetadataListController.addDistributorMetaData(req, res),
  readDistributorMetaData: (req, res) =>
    distributorMetadataListController.readDistributorMetaData(req, res),
  updateDistributorMetaData: (req, res) =>
    distributorMetadataListController.updateDistributorMetaData(req, res),
  deleteDistributorMetaData: (req, res) =>
    distributorMetadataListController.deleteDistributorMetaData(req, res)
};
