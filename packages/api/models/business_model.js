const mongoose = require('mongoose');

const portionInfoSchema = new mongoose.Schema({
  unitName: String,
  unitNumber: Number
});

const locationInventorySchema = new mongoose.Schema({
  portionNumber: Number,
  metaData: String
});

const locationLogSchema = new mongoose.Schema({
  locationName: String,
  logReason: String,
  initialPortion: Number,
  finalPortion: Number,
  updateDate: {
    type: Date
  }
});
//default: Date.now
const locationBucketLogSchema = new mongoose.Schema({
  locationBucket: String,
  locationBucketLog: [locationLogSchema]
});

const distributorItemSchema = new mongoose.Schema({
  distributorName: String,
  distributorItemName: String,
  distributorItemPortion: Number,
  distributorItemCost: Number,
  priorityChoice: {
    type: Number,
    default: 100
  }
});

const distributorMetaDataSchema = new mongoose.Schema({
  distributorName: String,
  distributorDeadlineDate: String,
  distributorDeliveryDate: String,
  distributorMetaData: String
});

const locationMetaDataSchema = new mongoose.Schema({
  locationName: String,
  locationAddress: String,
  locationMetaData: String
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
  estimateDeduction: { type: Number, default: 0 },
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
    businessName: String,
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
const LocationBucketLog = mongoose.model(
  'locationBucketLog',
  locationBucketLogSchema
);
const LocationLog = mongoose.model('LocationLog', locationLogSchema);
const DistributorItem = mongoose.model(
  'DistributorItem',
  distributorItemSchema
);
const DistributorMetaData = mongoose.model(
  'distributorMetaData',
  distributorMetaDataSchema
);
const LocationMetaData = mongoose.model(
  'locationMetaData',
  locationMetaDataSchema
);

module.exports = {
  PortionInfo,
  LocationInventory,
  LocationBucketLog,
  LocationLog,
  DistributorItem,
  DistributorMetaData,
  LocationMetaData,
  Item,
  Business
};
