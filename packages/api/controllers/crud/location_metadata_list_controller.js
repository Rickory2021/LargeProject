const { LocationMetaData } = require('../../models/business_model');
const GenericCRUDController = require('../crud/generic_crud_controller');

const mongoose = require('mongoose');

class LocationMetaDataController extends GenericCRUDController {
  constructor() {
    super();
  }

  async addLocationMetaData(req, res) {
    try {
      const businessId = req.query.businessId;

      // Need locationName to check if the document exists
      const locationName = req.body.locationName;

      const exists = await this.doesExistGeneric(
        businessId,
        'locationMetaDataList.locationName',
        locationName
      );

      if (exists) {
          return res.status(400).json({ message: 'Location name already exists.' });
      }

      const locationMetaData = {
        locationName: locationName,
        locationAddress: req.body.locationAddress,
        locationMetaData: req.body.locationMetaData
      };

      // TODO: Does not account for white space or case
      const result = await super.createGeneric(
        businessId,
        'locationMetaDataList',
        LocationMetaData,
        locationMetaData
      );

      if (result && result.modifiedCount > 0) {
        return res.status(200).json({ error: null });
      } else {
        return res
          .status(400)
          .json({ message: result });
      }

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async readLocationMetaData(req, res) {
    try {
      let businessId = new mongoose.Types.ObjectId(req.query.businessId);

      const locationMetaData = await super.readGeneric([
        {
          $match: { _id: businessId }
        },
        {
          $project: {
            locationMetaDataList: 1,
            _id: 0
          }
        }
      ]);

      if (!locationMetaData || locationMetaData.length === 0) {
        return res.status(404).json({
          message: 'No location metadata found for the given business ID'
        });
      }

      return res.status(200).json({
        locationMetaDataList: locationMetaData[0]?.locationMetaDataList || []
      });
    } catch (error) {
      console.error('Error reading location metadata:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // TODO: After item is complete, user should be able to edit locationName
  async updateLocationMetaData(req, res) {
    try {
      const { businessId, locationName } = req.query;

      const filterJson = {
        _id: businessId,
        'locationMetaDataList.locationName': locationName
      };

      const updateJson = {
        $set: {
          'locationMetaDataList.$.locationAddress': req.body.locationAddress,
          'locationMetaDataList.$.locationMetaData': req.body.locationMetaData
        }
      };

      await super.updateGeneric(filterJson, updateJson);

      return res.status(200).json({error: null});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteLocationMetaData(req, res) {
    try {
      const businessId = req.query.businessId;
      const locationName = req.query.locationName;

      if (!businessId || !locationName) {
        return res.status(400).json({
          message: 'Missing businessId or locationName in the request.'
        });
      }

      const objectId = new mongoose.Types.ObjectId(businessId);

      const result = await this.deleteGeneric(
        objectId,
        'locationMetaDataList',
        'locationName',
        locationName
      );

      return res.status(200).json({ error: null });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

let locationMetadataListController = new LocationMetaDataController();
module.exports = {
  addLocationMetaData: (req, res) =>
    locationMetadataListController.addLocationMetaData(req, res),
  readLocationMetaData: (req, res) =>
    locationMetadataListController.readLocationMetaData(req, res),
  updateLocationMetaData: (req, res) =>
    locationMetadataListController.updateLocationMetaData(req, res),
  deleteLocationMetaData: (req, res) =>
    locationMetadataListController.deleteLocationMetaData(req, res)
};
