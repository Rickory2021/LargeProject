const {
  PortionInfo,
  LocationInventory,
  LocationBucketLog,
  LocationLog,
  DistributorItem,
  DistributorMetaData,
  LocationMetaData,
  Item,
  Business
} = require('../../models/business_model');
const mongoose = require('mongoose');
// NOTE THAT LOCATION LOG Element is the only 3rd Level Hierarchy (Business=>Item=>LocationBucket=>LocationLog)
// Whereas others are all 2nd Level hierarchy

class GenericCRUDController {
  constructor() {}

  /**
   * Moves the Model to the Correct Business based off the BusinessId
   * @param {Business Id} businessId The Business Id that the Model will go to
   * @returns The Object based off the Id and the toModel with the information || NULL
   */
  async getBusinessQuery(businessId) {
    let queryObject = await Business.findById(businessId);
    return queryObject;
  }

  async getBusinessSubList(businessId, listField) {
    //let queryObject = await Business.findById(businessId)[listField];
    let queryObject = await Business.findById(businessId).select(listField);
    return queryObject;
  }

  async getEmployeeIdListQuery(businessId) {
    let queryObject = await Business.findById(businessId).employeeIdList;
    return queryObject;
  }

  async getItemListQuery(businessId) {
    let queryObject = await Business.findById(businessId).itemList;
    return queryObject;
  }

  async getDistributorMetaDataQuery(businessId) {
    let queryObject =
      await Business.findById(businessId).distributorMetaDataList;
    return queryObject;
  }

  async getLocationMetaDataQuery(businessId) {
    let queryObject = await Business.findById(businessId).locationMetaDataList;
    return queryObject;
  }

  /**
   * Moves the Model to the Correct Item based off the BusinessId and itemName
   * @param {Business Id} businessId The Business Id that the Model will go to
   * @returns The Object based off the Id and the toModel with the information || NULL
   */
  async navigateToItem(modelObject, businessId, itemName) {
    modelObject = this.navigateToBusiness(businessId);
    if (modelObject === null) {
      console.log('Business ID does not exist');
      return null;
    }
    // Your modelObject is no a Business, so w2e will access the Item List
    let itemNameFound = false;
    for (const item of modelObject.itemList) {
      if (item.name === itemName) {
        itemNameFound = true;
        modelObject = item;
        break;
      }
    }
    if (itemNameFound) {
      return modelObject;
    } else {
      console.log('Item Name was not found in that Business Id');
      modelObject = null;
      return null;
    }
  }

  /**
   * Moves the Model to the Correct Model based off the BusinessId and ItemName
   * @param {Business Id} businessId The Business Id that the Model will go to
   * @returns The Object based off the Id and the toModel with the information || NULL
   */
  async navigateToModel(modelObject, businessId, itemName = null) {
    console.log('Using navigateToModel From Generic');
    modelObject = this.navigateToItem(modelObject, businessId, itemName);
    if (modelObject === null) return null;
    if (this.areSchemasEqual(modelObject, Business)) {
      if (itemName !== null) console.log('ITEM NAME NOT USED');
    } else if (this.areSchemasEqual(modelObject, Item)) {
      modelObject = await modelObject.itemList;
      if (modelObject === null) {
        console.log('ItemList not found in Selected Item');
        return null;
      }
    } else if (this.areSchemasEqual(modelObject, PortionInfo)) {
      modelObject = await modelObject.portionInfoList;
      if (modelObject === null) {
        console.log('Portion Info not found in Selected Item');
        return null;
      }
    } else if (this.areSchemasEqual(modelObject, LocationBucketLog)) {
      modelObject = await modelObject.locationBucketLog;
      if (modelObject === null) {
        console.log('Location Bucket not found in Selected Item');
        return null;
      }
    } else if (this.areSchemasEqual(modelObject, DistributorItem)) {
      modelObject = await modelObject.distributorItemList;
      if (modelObject === null) {
        console.log('DistributorItem not found in Selected Item');
        return null;
      }
    } else if (this.areSchemasEqual(modelObject, DistributorMetaData)) {
      modelObject = await modelObject.distributorMetaDataList;
      if (modelObject === null) {
        console.log('Distributor MetaData not found in Selected Item');
        return null;
      }
    } else if (this.areSchemasEqual(modelObject, LocationMetaData)) {
      modelObject = await modelObject.locationMetaDataList;
      if (modelObject === null) {
        console.log('Location MetaData not found in Selected Item');
        return null;
      }
    }
    return modelObject;
  }

  /**
   * Moves the Model to the Correct Business based off the BusinessId
   * @param {Business Id} businessId The Business Id that the Model will go to
   * @returns The Object based off the Id and the toModel with the information || NULL
   */
  async navigateToBusiness(modelObject, businessId) {
    modelObject = await Business.findById(businessId);
    return modelObject;
  }

  /**
   * Checkes to see if the Schemas are identital
   * @param schema1
   * @param schema2
   * @returns True if Equal || False if not
   */
  areSchemasEqual(schema1, schema2) {
    return JSON.stringify(schema1.obj) === JSON.stringify(schema2.obj);
  }

  async createGenericObject(modelObject, newObject) {
    if (modelObject == null) {
      console.log('modelObject is null');
      return false;
    } else if (this.areSchemasEqual(modelObject, Business)) {
      console.log('createGenericObject > Use CreateBuinessAPI Instead');
      return false;
    }
    modelObject.push(newObject);
    await modelObject.save(); // Save the changes to the database
    console.log('New Object Saved:', modelObject);
    return true;
  }

  constructJson(stringsArray) {
    let jsonObject = {};
    jsonObject['_id'] = 0;
    stringsArray.forEach(str => {
      jsonObject[str] = 1;
    });
    return jsonObject;
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
      const result = await Business.updateMany(
        { _id: businessId },
        { $pull: { [arrayField]: { [fieldToCheck]: checkString } } }
      );

      console.log(
        `Delete embedded document with ${fieldToCheck}:${checkString} from ${arrayField}`
      );
      return result;
    } catch (error) {
      console.error('Error deleting embedded document:', error);
    }
  }
}

module.exports = GenericCRUDController;
