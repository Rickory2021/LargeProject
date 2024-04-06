const { Business } = require('../../models/business_model');
// NOTE THAT LOCATION LOG Element is the only 3rd Level Hierarchy (Business=>Item=>LocationBucket=>LocationLog)
// Whereas others are all 2nd Level hierarchy

class GenericCRUDController {
  constructor() {}

  async doesExistGeneric(businessId, field, value) {
    try {
      // Find a document with the provided ID and item name
      const existingItem = await Business.findOne({
        _id: businessId,
        [field]: value
      });

      // Check if the document exists
      if (existingItem !== null) {
        // Modify this line
        console.log(`ID: ${businessId} at ${field} value: ${value} does exist`);
        return true;
      } else {
        console.log(
          `ID: ${businessId} at ${field} value: ${value} does not exist`
        );
        return false;
      }
    } catch (error) {
      console.error('Error checking existence:', error);
      throw error; // Throw the error to be caught by the calling function
    }
  }

  async createGeneric(businessId, field, modelSchema, modelData) {
    try {
      // Construct the item using the Item model
      const newModelObject = new modelSchema(modelData);

      // Update the document by pushing the new item into the array
      const result = await Business.updateOne(
        { _id: businessId },
        { $push: { [field]: newModelObject } }
      );

      //Check if any documents were modified
      if (result.modifiedCount > 0) {
        console.log(`Successfully pushed new item to ${field}`);
      } else {
        console.log(`Failed to push new item to ${field}`);
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

  // async deleteGeneric(businessId, arrayField, fieldToCheck, checkString) {
  //   // console.log(matchJson);
  //   // console.log(unwind1stList);
  //   // console.log(projectFieldsArray);
  //   // let projectionJson = this.constructJson(projectFieldsArray);
  //   // console.log(projectionJson);
  //   // Update all documents where itemList contains an item with the specified itemId
  //   try {
  //     console.log('About to delete');
  //     console.log('Business ID:', businessId);
  //     console.log('Array Field:', arrayField);
  //     console.log('Field to Check:', fieldToCheck);
  //     console.log('Check String:', checkString);

  //     const result = await Business.updateOne(
  //       { _id: businessId },
  //       { $pull: { [arrayField]: { [fieldToCheck]: checkString } } }
  //     );

  //     console.log('MongoDB Update Result:', result);

  //     //Check if any documents were modified
  //     if (result.modifiedCount > 0) {
  //       console.log(
  //         `Successfully deleted all embedded document with ${fieldToCheck}:${checkString} from ${businessId}=>${arrayField}`
  //       );
  //     } else {
  //       console.log(
  //         `Failed to Delete all embedded documents with ${fieldToCheck}:${checkString} ${businessId}=>from ${arrayField}`
  //       );
  //     }
  //     return result;
  //   } catch (error) {
  //     console.error('Error deleting embedded document:', error);
  //     throw error; // Re-throw the error to be caught by the calling function
  //   }
  // }

  async deleteGeneric(businessId, arrayField, fieldToCheck, checkString) {
    try {
      const result = await Business.updateOne(
        { _id: businessId },
        { $pull: { [arrayField]: checkString } } // Modified to directly pull the checkString from the arrayField
      );
      if (result.modifiedCount > 0) {
        console.log(`Successfully deleted ${checkString} from ${arrayField}`);
      } else {
        console.log(`Failed to delete ${checkString} from ${arrayField}`);
      }
      return result;
    } catch (error) {
      console.error('Error deleting embedded document:', error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  }
}

module.exports = GenericCRUDController;
