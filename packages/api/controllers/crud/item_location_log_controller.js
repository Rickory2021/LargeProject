// Rename to business_operations.js?
const { LocationLog } = require('../../models/business_model');
const GenericCRUDController = require('./generic_crud_controller');
const { Business, LocationMetaData } = require('../../models/business_model');

const mongoose = require('mongoose');

class ItemLocationLogController extends GenericCRUDController {
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

  async doesExistLocationName(businessId, itemName, locationName) {
    try {
      const locationInfo = await Business.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(businessId) } },
        { $unwind: '$itemList' },
        { $match: { 'itemList.itemName': itemName } },
        { $project: { locationItemList: '$itemList.locationItemList' } },
        { $unwind: '$locationItemList' },
        { $match: { 'locationItemList.locationName': locationName } },
        { $project: { locationName: '$locationItemList.locationName' } }
      ]);
      // // console.log(locationInfo);
      if (locationInfo.length === 0) {
        // console.log(
        //   `locationInfo '${locationName}' not found for item '${itemName}' in business '${businessId}'`
        // );
        return false;
      } else {
        // console.log(
        //   `locationInfo '${locationName}' found for item '${itemName}' in business '${businessId}'`
        // );
        return true;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  async constructYearBucket(businessId, itemName, yearString) {
    try {
      // Step 1: Find the business
      const business = await Business.findById(businessId);
      if (!business) {
        throw new Error('Business not found');
      }

      // Step 2: Find the item within the business's items
      const item = await business.itemList.find(
        item => item.itemName === itemName
      );
      if (!item) {
        throw new Error('Item not found');
      }

      // Step 3: Find the location item log associated with the given location name
      let locationItemLog = item.locationItemLog.find(
        log => log.locationBucket === yearString
      );
      if (!locationItemLog) {
        // Step 4: Create a new location bucket log if it doesn't exist
        locationItemLog = {
          locationBucket: yearString,
          locationBucketLog: []
        };
        item.locationItemLog.push(locationItemLog);
      }
      // Step 5: Sort the locationItemLog array by locationBucket in descending order
      item.locationItemLog.sort((a, b) =>
        b.locationBucket.localeCompare(a.locationBucket)
      );
      await business.save();
      return true;
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  //req.query.businessId  {itemName,locationName,logReason,initialPortion,finalPortion,updateDate}
  async createLog(req, res) {
    let businessId = req.query.businessId;
    let {
      itemName,
      locationName,
      logReason,
      initialPortion,
      finalPortion,
      updateDate
    } = req.body;
    // console.log(
    //   `businessId:${businessId} itemName :${itemName} logReason :${logReason} logReason :${logReason} initialPortion :${initialPortion} finalPortion :${finalPortion} updateDate :${updateDate}`
    // );

    try {
      let newLocationLogObject = new LocationLog({
        locationName: locationName,
        logReason: logReason,
        initialPortion: initialPortion,
        finalPortion: finalPortion,
        updateDate: new Date(updateDate)
      });
      let newYearString = new Date(updateDate).getFullYear().toString();
      // Check if folder exist
      await this.constructYearBucket(businessId, itemName, newYearString);

      // Step 1: Find the Business by its ID
      const business = await Business.findById(businessId);

      if (!business) {
        // console.log('Business not found');
        return res.status(500).json({ error: 'Business not found' });
      }

      // Step 2: Find the Item within the Business by its itemName
      const item = await business.itemList.find(
        item => item.itemName === itemName
      );

      if (!item) {
        // console.log('Item not found in the Business');
        return res
          .status(500)
          .json({ error: 'Item not found in the Business' });
      }

      // Step 3: Find the locationItemLog within the Item by its locationName and yearString
      const locationItemLog = await item.locationItemLog.find(
        log => log.locationBucket === newYearString
      );

      if (!locationItemLog) {
        // console.log('LocationItemLog not found');
        return res.status(500).json({ error: 'LocationItemLog not found' });
      }

      // Step 4: Add a new entry to the locationBucketLog array
      locationItemLog.locationBucketLog.push(newLocationLogObject);

      // Step 5: Sort the locationBucketLog array by updateDate in descending order
      locationItemLog.locationBucketLog.sort(
        (a, b) => b.updateDate - a.updateDate
      );

      // Save the changes to the database
      const statusDetails = await business.save();

      // console.log('LocationBucketLog added successfully');
      return res.status(500).json({ statusDetails: statusDetails });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  { itemName, locationBucket }
  async readAllLogsInBucket(req, res) {
    try {
      const businessId = req.query.businessId;
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);
      let { itemName, locationBucket } = req.body;
      // console.log('About to read');
      // Using aggregation pipeline to filter and project data
      const locationLogs = await Business.aggregate([
        // Match the business by its ID
        { $match: { _id: new mongoose.Types.ObjectId(businessId) } },
        // Unwind the itemList array to access its elements
        { $unwind: '$itemList' },
        // Match the item by its itemName
        { $match: { 'itemList.itemName': itemName } },
        // Filter the locationItemLog array by locationBucket
        { $unwind: '$itemList.locationItemLog' },
        {
          $match: { 'itemList.locationItemLog.locationBucket': locationBucket }
        },
        // Project the desired fields from the locationItemLog array
        {
          $project: {
            locationLogs: '$itemList.locationItemLog.locationBucketLog'
          }
        }
      ]);

      //req.query.printedFieldName
      return res.status(200).json({ outputList: locationLogs });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId { itemName, locationName, updateDate }
  async deleteLog(req, res) {
    let businessId = req.query.businessId;
    let { itemName, updateDate } = req.body;
    let updateDateDate = new Date(updateDate);
    // console.log(`updateDateDate: ${updateDateDate.getFullYear().toString()}`);

    // console.log(
    //   `businessId:${businessId} itemName :${itemName} updateDate :${updateDateDate.toISOString()}`
    // );

    try {
      // Step 1: Find the Business by its ID
      const business = await Business.findById(businessId);

      if (!business) {
        // console.log('Business not found');
        return res.status(500).json({ error: 'Business not found' });
      }

      // Step 2: Find the Item within the Business by its itemName
      const item = await business.itemList.find(
        item => item.itemName === itemName
      );

      if (!item) {
        // console.log('Item not found in the Business');
        return res
          .status(500)
          .json({ error: 'Item not found in the Business' });
      }

      // Step 3: Find the locationItemLog within the Item by its locationName and yearString
      const locationItemLog = await item.locationItemLog.find(
        log => log.locationBucket === updateDateDate.getFullYear().toString()
      );

      if (!locationItemLog) {
        // console.log('LocationItemLog not found');
        return res.status(500).json({ error: 'LocationItemLog not found' });
      }

      // Step 4: Find the specific log entry based on updateDate
      const index = locationItemLog.locationBucketLog.findIndex(
        log => log.updateDate.toISOString === updateDateDate.toISOString
      );
      if (index === -1) {
        // console.log('Log entry not found in the LocationBucketLog');
        return res
          .status(500)
          .json({ error: 'Log entry not found in the LocationBucketLog' });
      }

      // Remove the entry from the locationBucketLog array
      locationItemLog.locationBucketLog.splice(index, 1);

      // Save the changes to the database
      const statusDetails = await business.save();

      // console.log('LocationBucketLog entry deleted successfully');
      return res.status(200).json({ statusDetails: statusDetails });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
let itemLocationLogController = new ItemLocationLogController();
module.exports = {
  createLog: (req, res) => itemLocationLogController.createLog(req, res),
  readAllLogsInBucket: (req, res) =>
    itemLocationLogController.readAllLogsInBucket(req, res),
  deleteLog: (req, res) => itemLocationLogController.deleteLog(req, res)
};
