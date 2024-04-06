const { LocationMetaData } = require('../../models/business_model');
const GenericCRUDController = require('./generic_crud_controller');

const mongoose = require('mongoose');

class LocationMetaDataController extends GenericCRUDController {
  constructor() {
    super();
  }
  // ?businessId  { locationName, locationAddress, locationMetaData }
  async createLocationMetaData(req, res) {
    try {
      const businessId = req.query.businessId;
      const { locationName, locationAddress, locationMetaData } = req.body;

      // Need locationName to check if the document exists
      const exists = await this.doesExistGeneric(
        businessId,
        'locationMetaDataList.locationName',
        locationName
      );

      if (exists) {
        return res.status(400).json({ error: 'Location name already exists.' });
      }

      const locationMetaDataObject = {
        locationName: locationName,
        locationAddress: locationAddress,
        locationMetaData: locationMetaData
      };

      // TODO: Does not account for white space or case
      const statusDetails = await super.createGeneric(
        businessId,
        'locationMetaDataList',
        LocationMetaData,
        locationMetaDataObject
      );

      if (statusDetails && statusDetails.modifiedCount > 0) {
        return res.status(200).json({ statusDetails: [statusDetails] });
      } else {
        return res.status(400).json({ statusDetails: [statusDetails] });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // req.query.businessId);
  async readAllLocationMetaData(req, res) {
    try {
      let businessId = new mongoose.Types.ObjectId(req.query.businessId);

      const fieldValues = await super.readGeneric([
        { $match: { _id: businessId } },
        { $project: { locationMetaDataList: 1, _id: 0 } }
      ]);

      if (!fieldValues || fieldValues.length === 0) {
        return res.status(404).json({
          error: 'No location metadata found for the given business ID'
        });
      }

      return res.status(200).json({
        outputList: fieldValues[0]?.locationMetaDataList || []
      });
    } catch (error) {
      console.error('Error reading location metadata:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // TODO: UpdateLocationMetaDataName NEEDS TO UPDATE ALL EXISTING LOCATIONS in Items and Logs
  // req.query.businessId { findLocationName, newLocationName }
  async updateLocationMetaDataName(req, res) {
    try {
      const { businessId } = req.query;
      const { findLocationName, newLocationName } = req.body;

      const filterJson = {
        _id: businessId,
        'locationMetaDataList.locationName': findLocationName
      };

      const updateJson = {
        $set: { 'locationMetaDataList.$.locationName': newLocationName }
      };

      const statusDetails = await super.updateGeneric(filterJson, updateJson);

      return res.status(200).json({ statusDetails: [statusDetails] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // TODO: UpdateLocationMetaDataName NEEDS TO UPDATE ALL EXISTING LOCATIONS in Items and Logs
  // req.query.businessId { findLocationName, newLocationAddress }
  async updateLocationMetaDataAddress(req, res) {
    try {
      const { businessId } = req.query;
      const { findLocationName, newLocationAddress } = req.body;

      const filterJson = {
        _id: businessId,
        'locationMetaDataList.locationName': findLocationName
      };

      const updateJson = {
        $set: { 'locationMetaDataList.$.locationAddress': newLocationAddress }
      };

      const statusDetails = await super.updateGeneric(filterJson, updateJson);

      return res.status(200).json({ statusDetails: [statusDetails] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // TODO: UpdateLocationMetaDataName NEEDS TO UPDATE ALL EXISTING LOCATIONS in Items and Logs
  // req.query.businessId { findLocationName, newLocationMetaData }
  async updateLocationMetaDataMetaData(req, res) {
    try {
      const { businessId } = req.query;
      const { findLocationName, newLocationMetaData } = req.body;

      const filterJson = {
        _id: businessId,
        'locationMetaDataList.locationName': findLocationName
      };

      const updateJson = {
        $set: { 'locationMetaDataList.$.locationMetaData': newLocationMetaData }
      };

      const statusDetails = await super.updateGeneric(filterJson, updateJson);

      return res.status(200).json({ statusDetails: [statusDetails] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // req.query.businessId  {locationName}
  async deleteLocationMetaData(req, res) {
    try {
      const businessId = req.query.businessId;
      const { locationName } = req.body;

      if (!businessId || !locationName) {
        return res.status(400).json({
          message: 'Missing businessId or locationName in the request.'
        });
      }

      const objectId = new mongoose.Types.ObjectId(businessId);

      const statusDetails = await this.deleteGeneric(
        objectId,
        'locationMetaDataList',
        'locationName',
        locationName
      );

      return res.status(200).json({ statusDetails: [statusDetails] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

let locationMetadataListController = new LocationMetaDataController();
module.exports = {
  createLocationMetaData: (req, res) =>
    locationMetadataListController.createLocationMetaData(req, res),
  readAllLocationMetaData: (req, res) =>
    locationMetadataListController.readAllLocationMetaData(req, res),
  updateLocationMetaDataName: (req, res) =>
    locationMetadataListController.updateLocationMetaDataName(req, res),
  updateLocationMetaDataAddress: (req, res) =>
    locationMetadataListController.updateLocationMetaDataAddress(req, res),
  updateLocationMetaDataMetaData: (req, res) =>
    locationMetadataListController.updateLocationMetaDataMetaData(req, res),
  deleteLocationMetaData: (req, res) =>
    locationMetadataListController.deleteLocationMetaData(req, res)
};
