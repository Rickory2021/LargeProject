const router = require('express').Router();

const {
  readAllEmployeeIds,
  deleteEmployeeId
} = require('../controllers/crud/employee_id_list_controller');

const {
  createItem,
  readAllItemName,
  readOneItem,
  updateItemName,
  deleteItem
} = require('../controllers/crud/item_controller');

const {
  createPortionInfo,
  readAllPortionInfo,
  updatePortionInfoName,
  updatePortionInfoNumber,
  deletePortionInfo
} = require('../controllers/crud/item_portion_info_controller');

const {
  createRelation,
  readAllItemUsedIn,
  readAllItemNeeded,
  updateItemRelationUnitCost,
  deleteRelation
} = require('../controllers/crud/item_relation_controller');

const {
  createItemLocation,
  readAllItemLocationName,
  readOneItemLocation,
  updateItemLocationName,
  deleteItemLocation
} = require('../controllers/crud/item_location_controller');

const {
  createInventory,
  readAllInventory,
  updateInventoryNumber,
  updateInventoryMetaData,
  deleteInventory
} = require('../controllers/crud/item_inventory_controller');

const {
  createLog,
  readAllLogsInBucket,
  deleteLog
} = require('../controllers/crud/item_location_log_controller');

const {
  addDistributorMetaData,
  readDistributorMetaData,
  updateDistributorMetaData,
  deleteDistributorMetaData
} = require('../controllers/crud/distributor_metadata_list_controller');

const {
  createLocationMetaData,
  readAllLocationMetaData,
  updateLocationMetaDataName,
  updateLocationMetaDataAddress,
  updateLocationMetaDataMetaData,
  deleteLocationMetaData
} = require('../controllers/crud/location_metadata_controller');

//
// Employee Id List Route /crud
router.post('/business/employee-id-list/read-all', readAllEmployeeIds); //POST /api/crud/business/employee-id-list/read-all?businessId=
router.post('/business/employee-id-list/delete', deleteEmployeeId); //POST /api/crud/business/employee-id-list/delete?businessId=&employeeId=

//
// Item List Route /crud
router.post('/business/item-list/create', createItem); // ?businessId {itemName}
router.post('/business/item-list/read-all', readAllItemName); // ?businessId
router.post('/business/item-list/read-one', readOneItem); // ?businessId {itemName}
//TODO: Update Name doesn't Update Relations, Log, etc.
router.post('/business/item-list/update-name', updateItemName); // ?businessId {findItemName, newItemName}
router.post('/business/item-list/delete', deleteItem); // ?businessId {itemName}

//
// Portion List Info
router.post('/business/portion-info-list/create', createPortionInfo); // ?businessId {itemName, unitName,unitNumber}
router.post('/business/portion-info-list/read-all', readAllPortionInfo); // ?businessId  {itemName}
// NOTE: Updating Name does not affect portioning of itemNeededList and usedInList Items
router.post('/business/portion-info-list/update-name', updatePortionInfoName); // ?businessId { itemName, findUnitName, newUnitName }
// NOTE: Updating Number does not affect portioning of itemNeededList and usedInList Items
router.post(
  '/business/portion-info-list/update-number',
  updatePortionInfoNumber
); // ?businessId { itemName, findUnitName, newUnitNumber }
router.post('/business/portion-info-list/delete', deletePortionInfo); // ?businessId { itemName, unitName }

//
// Relationship (usedInList & itemNeededList) Info
router.post('/business/item-relation/create', createRelation); // ?businessId { rawItemName, finishedItemName, unitCost }
router.post('/business/item-relation/read-used-in', readAllItemUsedIn); // ?businessId {itemName}
router.post('/business/item-relation/read-needed', readAllItemNeeded); // ?businessId {itemName}
router.post(
  '/business/item-relation/update-unit-cost',
  updateItemRelationUnitCost
); // ?businessId {rawItemName,finishedItemName,newUnitCost}
router.post('/business/item-relation/delete', deleteRelation); // ?businessId { rawItemName, finishedItemName }

//
// Item Location
router.post('/business/item-location/create', createItemLocation); // ?businessId {itemName, locationName}
router.post('/business/item-location/read-all', readAllItemLocationName); // ?businessId { itemName }
router.post('/business/item-location/read-one', readOneItemLocation); // ?businessId { itemName, locationName }
// TODO: DOES NOT UPDATE LOCATION META DATA & LOG YET
router.post('/business/item-location/update-name', updateItemLocationName); // ?businessId { itemName, findLocationName, newLocationName }
router.post('/business/item-location/delete', deleteItemLocation); // ?businessId { itemName, locationName }

//
// Item Location Inventory
router.post('/business/item-inventory/create', createInventory); // ?businessId { itemName, locationName, portionNumber, metaData, logReason }
router.post('/business/item-inventory/read-all', readAllInventory); // ?businessId { itemName, locationName }
// TODO: DOES NOT UPDATE LOCATION METADATA & LOG YET
router.post('/business/item-inventory/update-number', updateInventoryNumber); // ?businessId { itemName, findLocationName, index, newNumber, logReason }
router.post(
  '/business/item-inventory/update-metadata',
  updateInventoryMetaData
); // ?businessId { itemName, findLocationName, index, newMetaData }
// TODO: DOES NOT UPDATE LOCATION META DATA & LOG YET
router.post('/business/item-inventory/delete', deleteInventory); // ?businessId { itemName, locationName, index }

//
// Location Logs
// logReason: "Transit" [Use when moving one object to another location]
// logReason: "Manual Count" [Use when manually editing quantity]
// logReason: "Inventory Arrival" [Use when adding new Objects in Location]
// logReason: "Predicted Estimate" [Use when editting with uncertainity]
// Note: To Calculate Derivative, use Date, "Manual Count" & "Inventory Arrival"
router.post('/business/item-location-log/create', createLog); // ?businessId  {itemName,locationName,logReason,initialPortion,finalPortion,updateDate}
router.post('/business/item-location-log/read-all', readAllLogsInBucket); // ?businessId  { itemName, locationBucket }
router.post('/business/item-location-log/delete', deleteLog); // ?businessId { itemName, updateDate }

//
// Distributor MetaData
router.post('/business/distributor-metadata-list/add', addDistributorMetaData);
router.get('/business/distributor-metadata-list/read', readDistributorMetaData);
router.post(
  '/business/distributor-metadata-list/update',
  updateDistributorMetaData
);
router.post(
  '/business/distributor-metadata-list/delete',
  deleteDistributorMetaData
);

//
// Location MetaData
router.post('/business/location-metadata-list/create', createLocationMetaData); // ?businessId  { locationName, locationAddress, locationMetaData }
router.post(
  '/business/location-metadata-list/read-all',
  readAllLocationMetaData
); // ?businessId
// TODO: Update Name does not update all locations with the same name in itemList and Log
router.post(
  '/business/location-metadata-list/update-name',
  updateLocationMetaDataName
); // ?businessId  { findLocationName, newLocationName }
router.post(
  '/business/location-metadata-list/update-address',
  updateLocationMetaDataAddress
); // ?businessId  { findLocationName, newLocationAddress }
router.post(
  '/business/location-metadata-list/update-metadata',
  updateLocationMetaDataMetaData
); // ?businessId  { findLocationName, newLocationMetaData }
router.post('/business/location-metadata-list/delete', deleteLocationMetaData); // ?businessId {locationName}

module.exports = router;
