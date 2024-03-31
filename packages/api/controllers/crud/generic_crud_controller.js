const {
  Business,
  Item,
  PortionInfo,
  LocationInventory,
  locationBucketLog,
  LocationLog,
  DistributorItem,
  distributorMetaData,
  locationMetaData
} = require('../../models/business_model');

// NOTE THAT LOCATION LOG Element is the only 3rd Level Hierarchy (Business=>Item=>LocationBucket=>LocationLog)
// Whereas others are all 2nd Level hierarchy

class GenericCRUDController {
  constructor(toModel) {
    this.toModel = toModel;
    this.BusinessModel = Business;
    this.ItemModel = Item;
    this.PortionInfoModel = PortionInfo;
    this.LocationInventoryModel = LocationInventory;
    this.locationBucketLogModel = locationBucketLog;
    this.LocationLogModel = LocationLog;
    this.DistributorItemModel = DistributorItem;
    this.distributorMetaDataModel = distributorMetaData;
    this.locationMetaDataModel = locationMetaData;
    this.modelObject = null;
  }

  /**
   * Moves the Model to the Correct Item based off the BusinessId and itemName
   * @param {Business Id} businessId The Business Id that the Model will go to
   * @returns The Object based off the Id and the toModel with the information || NULL
   */
  navigateToItem = async (businessId, itemName) => {
    this.modelObject = this.navigateToBusiness(businessId);
    if (this.modelObject === null) {
      console.log('Business ID does not exist');
      return null;
    }
    // Your modelObject is no a Business, so w2e will access the Item List
    let itemNameFound = false;
    for (const item of this.modelObject.itemList) {
      if (item.name === itemName) {
        itemNameFound = true;
        this.modelObject = item;
        break;
      }
    }
    if (itemNameFound) {
      return this.modelObject;
    } else {
      console.log('Item Name was not found in that Business Id');
      this.modelObject = null;
      return null;
    }
  };

  /**
   * Moves the Model to the Correct Model based off the BusinessId and ItemName
   * @param {Business Id} businessId The Business Id that the Model will go to
   * @returns The Object based off the Id and the toModel with the information || NULL
   */
  navigateToModel = async (businessId, itemName = null) => {
    console.log('Using navigateToModel From Generic');
    this.modelObject = this.navigateToItem(businessId, itemName);
    if (this.modelObject === null) return null;
    if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      if (itemName !== null) console.log('ITEM NAME NOT USED');
    } else if (this.areSchemasEqual(this.toModel, this.ItemModel)) {
      this.modelObject = await this.modelObject.portionInfoList;
      if (this.modelObject === null) {
        console.log('Portion Info not found in Selected Item');
        return null;
      }
    } else if (this.areSchemasEqual(this.toModel, this.PortionInfoModel)) {
      this.modelObject = await this.modelObject.portionInfoList;
      if (this.modelObject === null) {
        console.log('Portion Info not found in Selected Item');
        return null;
      }
    } else if (this.areSchemasEqual(this.toModel, this.locationBucketLog)) {
      this.modelObject = await this.modelObject.locationBucketLog;
      if (this.modelObject === null) {
        console.log('Location Bucket not found in Selected Item');
        return null;
      }
    } else if (this.areSchemasEqual(this.toModel, this.DistributorItemModel)) {
      this.modelObject = await this.modelObject.distributorItemList;
      if (this.modelObject === null) {
        console.log('DistributorItem not found in Selected Item');
        return null;
      }
    } else if (
      this.areSchemasEqual(this.toModel, this.distributorMetaDataModel)
    ) {
      this.modelObject = await this.modelObject.distributorMetaDataList;
      if (this.modelObject === null) {
        console.log('Distributor MetaData not found in Selected Item');
        return null;
      }
    } else if (this.areSchemasEqual(this.toModel, this.locationMetaDataModel)) {
      this.modelObject = await this.modelObject.locationMetaDataList;
      if (this.modelObject === null) {
        console.log('Location MetaData not found in Selected Item');
        return null;
      }
    }
    return this.modelObject;
  };

  /**
   * Moves the Model to the Correct Business based off the BusinessId
   * @param {Business Id} businessId The Business Id that the Model will go to
   * @returns The Object based off the Id and the toModel with the information || NULL
   */
  navigateToBusiness = async businessId => {
    this.modelObject = await this.BusinessModel.findById(businessId);
    return this.modelObject;
  };

  /**
   * Checkes to see if the Schemas are identital
   * @param schema1
   * @param schema2
   * @returns True if Equal || False if not
   */
  areSchemasEqual = (schema1, schema2) => {
    return JSON.stringify(schema1) === JSON.stringify(schema2);
  };

  createGenericObject = async newObject => {
    if (this.modelObject == null) {
      console.log('modelObject is null');
      return false;
    } else if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      console.log('Use CreateBuinessAPI Instead');
      return false;
    }
    this.modelObject.push(newObject);
    await this.modelObject.save(); // Save the changes to the database
    console.log('New Object Saved:', this.modelObject);
    return true;
  };

  readListOfGenericObject = async printedFieldNameList => {
    if (this.modelObject == null) {
      console.log('modelObject is null');
      return null;
    } else if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      console.log('Use CreateBuinessAPI Instead');
      return null;
    }
    try {
      const fieldInfoList = await this.modelObject.find(
        {},
        printedFieldNameList.join(' ')
      );
      return fieldInfoList.map(doc => {
        const mappedDoc = {};
        printedFieldNameList.forEach(fieldName => {
          mappedDoc[fieldName] = doc[fieldName];
        });
        return mappedDoc;
      });
    } catch (error) {
      console.error('Error getting list:', error);
      throw error;
    }
  };

  findListOfGenericObject = async (field, value) => {
    if (this.modelObject == null) {
      console.log('modelObject is null');
      return null;
    } else if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      console.log('Use CreateBuinessAPI Instead');
      return null;
    }
    try {
      const statusUpdate = await this.modelObject.find({ [field]: value });
      return statusUpdate;
    } catch (error) {
      console.error('Error getting list:', error);
      throw error;
    }
  };

  findOneGenericObject = async (identityField, identityValue) => {
    if (this.modelObject == null) {
      console.log('modelObject is null');
      return null;
    } else if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      console.log('Use BuinessAPI Instead');
      return null;
    }
    try {
      const statusUpdate = await this.modelObject.findOne({
        [identityField]: identityValue
      });
      return statusUpdate;
    } catch (error) {
      console.error('Error getting list:', error);
      throw error;
    }
  };

  updateListOfGenericObject = async (
    identityField,
    identityValue,
    editField,
    editValue
  ) => {
    if (this.modelObject == null) {
      console.log('modelObject is null');
      return [];
    } else if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      console.log('Use BuinessAPI Instead');
      return false;
    }
    try {
      const statusUpdate = await this.modelObject.updateMany(
        { [identityField]: identityValue },
        { $set: { [editField]: editValue } }
      );
      return statusUpdate;
    } catch (error) {
      console.error('Error getting list:', error);
      throw error;
    }
  };

  updateOneGenericObject = async (
    identityField,
    identityValue,
    editField,
    editValue
  ) => {
    if (this.modelObject == null) {
      console.log('modelObject is null');
      return null;
    } else if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      console.log('Use BuinessAPI Instead');
      return null;
    }
    try {
      const statusUpdate = await this.modelObject.updateOne(
        { [identityField]: identityValue },
        { $set: { [editField]: editValue } }
      );
      return statusUpdate;
    } catch (error) {
      console.error('Error getting list:', error);
      throw error;
    }
  };

  deleteOneGenericObject = async (identityField, identityValue) => {
    if (this.modelObject == null) {
      console.log('modelObject is null');
      return null;
    } else if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      console.log('Use BuinessAPI Instead');
      return null;
    }
    try {
      const statusUpdate = await this.modelObject.deleteOne({
        [identityField]: identityValue
      });
      return statusUpdate;
    } catch (error) {
      console.error('Error getting list:', error);
      throw error;
    }
  };

  deleteListOfGenericObject = async (
    identityField,
    identityValue,
    editField,
    editValue
  ) => {
    if (this.modelObject == null) {
      console.log('modelObject is null');
      return [];
    } else if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      console.log('Use BuinessAPI Instead');
      return false;
    }
    try {
      const statusUpdate = await this.modelObject.deleteMany(
        { [identityField]: identityValue },
        { $set: { [editField]: editValue } }
      );
      return statusUpdate;
    } catch (error) {
      console.error('Error getting list:', error);
      throw error;
    }
  };
}
module.exports = GenericCRUDController;
