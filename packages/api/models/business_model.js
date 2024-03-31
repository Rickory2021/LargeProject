const mongoose = require('mongoose');

const portionInfoSchema = new mongoose.Schema({
  unitName: String,
  unitNumber: Number
});

const locationInventorySchema = new mongoose.Schema({
  portionNumber: Number,
  metaData: String
});

const locationBucketLogSchema = new mongoose.Schema({
  locationBucket: String,
  locationBucketLog: [locationLogSchema]
});

const locationLogSchema = new mongoose.Schema({
  locationName: String,
  initialPortion: Number,
  finalPortion: Number,
  updateDate: Date
});

const distributorItemSchema = new mongoose.Schema({
  distributorName: String,
  distributorItemName: String,
  distributorItemPortion: Number,
  distributorItemCost: Number,
  priorityChoice: Number
});

const distributorMetaDataSchema = new mongoose.Schema({
  distributorName: String,
  distributorDeadlineDate: String,
  distributorDeliveryDate: String,
  distributorMetaData: String
});

const locationMetaDataSchema = new mongoose.Schema({
  distributorName: String,
  distributorDeadlineDate: String,
  distributorDeliveryDate: String,
  distributorMetaData: String
});

const itemSchema = new mongoose.Schema({
  itemName: String,
  portionInfoList: [portionInfoSchema],
  usedInList: [
    {
      itemName: String,
      unitCost: Number
    }
  ],
  itemNeededList: [
    {
      itemName: String,
      unitCost: Number
    }
  ],
  locationItemList: [
    {
      locationName: String,
      inventoryList: [locationInventorySchema]
    }
  ],
  locationItemLog: [locationBucketLogSchema],
  distributorItemList: [distributorItemSchema]
});

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true
    },
    employeeIdList: [String],
    itemList: [itemSchema],
    distributorMetaDataList: [distributorMetaDataSchema],
    locationMetaDataList: [locationMetaDataSchema]
  },
  { collection: 'businesses' }
);

const Business = mongoose.model('Business', businessSchema);
const Item = mongoose.model('Item', itemSchema);
const PortionInfo = mongoose.model('PortionInfo', portionInfoSchema);
const LocationInventory = mongoose.model(
  'LocationInventory',
  locationInventorySchema
);
const locationBucketLog = mongoose.model(
  'locationBucketLog',
  locationBucketLogSchema
);
const LocationLog = mongoose.model('LocationLog', locationLogSchema);
const DistributorItem = mongoose.model(
  'DistributorItem',
  distributorItemSchema
);
const distributorMetaData = mongoose.model(
  'distributorMetaData',
  distributorMetaDataSchema
);
const locationMetaData = mongoose.model(
  'locationMetaData',
  locationMetaDataSchema
);

module.exports = {
  Business,
  Item,
  PortionInfo,
  LocationInventory,
  locationBucketLog,
  LocationLog,
  DistributorItem,
  distributorMetaData,
  locationMetaData
};
