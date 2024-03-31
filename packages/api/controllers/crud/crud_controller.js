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

class CRUDController {
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
    this.modelObject = this.navigateToItem(businessId, itemName);
    if (this.modelObject === null) return null;
    if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      if (itemName !== null) console.log('ITEM NAME NOT USED');
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
    return JSON.stringify(schema1.obj) === JSON.stringify(schema2.obj);
  };

  createGenericObject = async newObject => {
    if (this.modelObject == null) {
      console.log('modelObject is null');
      return false;
    } else if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      console.log('Use CreateBuinessAPI Instead');
      return false;
    }
    // Add a new address
    this.modelObject.push(newObject);
    await this.modelObject.save(); // Save the changes to the database
    console.log('New Object Saved:', this.modelObject);
    return true;
  };

  readListOfGenericObject = async (field, value) => {
    if (this.modelObject == null) {
      console.log('modelObject is null');
      return [];
    } else if (this.areSchemasEqual(this.toModel, this.BusinessModel)) {
      console.log('Use CreateBuinessAPI Instead');
      return false;
    }
    // Add a new address
    this.modelObject.push(newObject);
    await this.modelObject.save(); // Save the changes to the database
    console.log('New Object Saved:', this.modelObject);
    return true;
  };

  create = async (req, res) => {
    // Navigate
    try {
      const newItem = new this.model(req.body);
      await newItem.save();
      res.status(201).send(newItem);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  findAll = async (req, res) => {
    try {
      const items = await this.model.find({});
      res.send(items);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  update = async (req, res) => {
    try {
      const item = await this.model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!item) {
        return res.status(404).send();
      }
      res.send(item);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  delete = async (req, res) => {
    try {
      const item = await this.model.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).send();
      }
      res.send(item);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}
module.exports = CRUDController;
