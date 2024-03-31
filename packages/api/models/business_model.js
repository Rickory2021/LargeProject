const mongoose = require('mongoose');

const portionInfoSchema = new mongoose.Schema({
  unitName: {
    type: String,
    required: true
  },
  unitNumber: Number
});

const locationInventorySchema = new mongoose.Schema({
  portionNumber: {
    type: Number,
    required: true
  },
  metaData: String
});

const locationLogSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: true
  },
  initialPortion: Number,
  finalPortion: Number,
  updateDate: {
    type: Date,
    default: Date.now
  }
});

const locationBucketLogSchema = new mongoose.Schema({
  locationBucket: {
    type: String,
    required: true
  },
  locationBucketLog: [locationLogSchema]
});

const distributorItemSchema = new mongoose.Schema({
  distributorName: {
    type: String,
    required: true
  },
  distributorItemName: String,
  distributorItemPortion: Number,
  distributorItemCost: Number,
  priorityChoice: {
    type: Number,
    default: 100
  }
});

const distributorMetaDataSchema = new mongoose.Schema({
  distributorName: {
    type: String,
    required: true
  },
  distributorDeadlineDate: String,
  distributorDeliveryDate: String,
  distributorMetaData: String
});

const locationMetaDataSchema = new mongoose.Schema({
  distributorName: {
    type: String,
    required: true
  },
  distributorDeadlineDate: String,
  distributorDeliveryDate: String,
  distributorMetaData: String
});

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
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
