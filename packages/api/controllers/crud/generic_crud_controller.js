const { Business } = require('../../models/business_model');
// NOTE THAT LOCATION LOG Element is the only 3rd Level Hierarchy (Business=>Item=>LocationBucket=>LocationLog)
// Whereas others are all 2nd Level hierarchy

class GenericCRUDController {
  constructor() {}

  async doesExist(businessId, field, value) {
    try {
      // Find a document with the provided ID and item name
      const existingItem = await Business.findOne({
        _id: businessId,
        [field]: value
      });

      // Check if the document exists
      if (existingItem.list !== null) {
        console.log(`ID: ${businessId} at ${field} value: ${value} does exist`);
        return true;
      } else {
        console.log(
          `ID: ${businessId} at ${field} value: ${value} do not exist`
        );
        return false;
      }
    } catch (error) {
      console.error('Error checking existence:', error);
    }
  }

  async createGeneric(businessId, arrayField, modelSchema, modelData) {
    try {
      // Construct the item using the Item model
      const newModelObject = new modelSchema(modelData);

      // Update the document by pushing the new item into the array
      const result = await Business.updateOne(
        { _id: businessId },
        { $push: { [arrayField]: newModelObject } }
      );

      //Check if any documents were modified
      if (result.modifiedCount > 0) {
        console.log(`Successfully pushed new item to ${arrayField}`);
      } else {
        console.log(`Failed to push new item to ${arrayField}`);
      }
      return result;
    } catch (error) {
      console.error('Error pushing item:', error);
    }
  }

  async readGeneric(aggregateJsonList) {
    // console.log(matchJson);
    // console.log(unwind1stList);
    // console.log(projectFieldsArray);
    // let projectionJson = this.constructJson(projectFieldsArray);
    // console.log(projectionJson);
    try {
      const result = await Business.aggregate([
        // { $limit: outputSize }, // Project only the name field for each post
        // { $skip: outset } // Project only the name field for each post
        aggregateJsonList
      ]);

      if (!result || result.length === 0) {
        console.log('User or posts not found');
        return null;
      }

      // Extract the names from the result
      console.log('result from generic:', result);
      return result;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async updateGeneric(filterJson, updateJson) {
    // console.log(matchJson);
    // console.log(unwind1stList);
    // console.log(projectFieldsArray);
    // let projectionJson = this.constructJson(projectFieldsArray);
    // console.log(projectionJson);
    console.log(updateJson);
    try {
      const result = await Business.updateMany(
        // { $limit: outputSize }, // Project only the name field for each post
        // { $skip: outset } // Project only the name field for each post
        filterJson,
        updateJson
      );

      if (!result || result.length === 0) {
        console.log('User or posts not found');
        return null;
      }

      // Extract the names from the result
      console.log('result from generic:', result);
      return result;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async deleteGeneric(businessId, arrayField, fieldToCheck, checkString) {
    // console.log(matchJson);
    // console.log(unwind1stList);
    // console.log(projectFieldsArray);
    // let projectionJson = this.constructJson(projectFieldsArray);
    // console.log(projectionJson);
    // Update all documents where itemList contains an item with the specified itemId
    try {
      const result = await Business.updateOne(
        { _id: businessId },
        { $pull: { [arrayField]: { [fieldToCheck]: checkString } } }
      );
      //Check if any documents were modified
      if (result.modifiedCount > 0) {
        console.log(
          `Successfully Delete All embedded document with ${fieldToCheck}:${checkString} from ${businessId}=>${arrayField}`
        );
      } else {
        console.log(
          `Failed Delete embedded All document with ${fieldToCheck}:${checkString} ${businessId}=>from ${arrayField}`
        );
      }
      return result;
    } catch (error) {
      console.error('Error deleting embedded document:', error);
    }
  }
}

module.exports = GenericCRUDController;
