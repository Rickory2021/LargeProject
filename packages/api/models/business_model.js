const mongoose = require('mongoose');

const portionInfoSchema = new mongoose.Schema({
  unitName: String,
  unitNumber: Number
});

const inventorySchema = new mongoose.Schema({
  portionNumber: Number,
  metaData: String
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

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true
    },
    employeeIdList: [String],
    itemList: [
      {
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
        locationList: [
          {
            locationName: String,
            inventoryList: [inventorySchema]
          }
        ],
        locationLog: [locationLogSchema],
        distributorItemList: [distributorItemSchema]
      }
    ],
    distributorList: [
      {
        distributorName: String,
        distributorDeadlineDate: String,
        distributorDeliveryDate: String,
        distributorMetaData: String
      }
    ],
    locationList: [
      {
        locationName: String,
        locationAddress: String,
        locationMetaData: String
      }
    ]
  },
  { collection: 'businesses' }
);

const Business = mongoose.model('businesses', businessSchema);

module.exports = Business;
