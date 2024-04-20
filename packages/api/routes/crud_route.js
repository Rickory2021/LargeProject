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
  deleteItem,
  getTotalItemCount
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
  readEstimateDeduction,
  updateEstimateDeduction,
  calculateEstimate
} = require('../controllers/crud/estimate_deduction_controller');
const {
  createItemLocation,
  readAllItemLocationName,
  readOneItemLocation,
  updateItemLocationName,
  deleteItemLocation,
  getTotalLocationCount,
  getOneRecentDate
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
  createLocationMetaData,
  readAllLocationMetaData,
  readOneLocationMetaData,
  updateLocationMetaDataName,
  updateLocationMetaDataAddress,
  updateLocationMetaDataMetaData,
  deleteLocationMetaData
} = require('../controllers/crud/location_metadata_controller');
const {
  createDistributorItem,
  readAllDisributorItem,
  updateDistributorItemName,
  updateDistributorItemPortion,
  updateDistributorItemCost,
  updateDistributorItemPriorityChoice,
  deleteDistributorItem
} = require('../controllers/crud/distributor_item_controller');
const {
  createDistributorMetaData,
  readAllDistributorMetaData,
  readOneDistributorMetaData,
  updateDistributorMetaDataName,
  updateDistributorMetaDataDeadlineDate,
  updateDistributorMetaDataDeliveryDate,
  updateDistributorMetaDataMetaData,
  deleteDistributorMetaData
} = require('../controllers/crud/distributor_metadata_controller');

//
// Employee Id List Route /crud
router.post('/business/employee-id-list/read-all', readAllEmployeeIds); //POST ?businessId
router.post('/business/employee-id-list/delete', deleteEmployeeId); //POST ?businessId {employeeId}

//
// Item List Route /crud
router.post('/business/item-list/create', createItem); // ?businessId {itemName}
router.post('/business/item-list/read-all', readAllItemName); // ?businessId
router.post('/business/item-list/read-one', readOneItem); // ?businessId {itemName}
//TODO: Update Name doesn't Update Relations, Log, etc.
router.post('/business/item-list/update-name', updateItemName); // ?businessId {findItemName, newItemName}
router.post('/business/item-list/delete', deleteItem); // ?businessId {itemName}
router.post('/business/item-list/total-item-count', getTotalItemCount); // ?businessId {itemName}

//
// Portion List Info
router.post('/business/portion-info-list/create', createPortionInfo); // ?businessId {itemName, unitName,unitNumber}
router.post('/business/portion-info-list/read-all', readAllPortionInfo); // ?businessId  {itemName}
router.post('/business/portion-info-list/update-name', updatePortionInfoName); // ?businessId { itemName, findUnitName, newUnitName }
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
// Estimate Deduction
router.post('/business/estimate-deduction/read', readEstimateDeduction); // ?businessId {itemName}
router.post('/business/estimate-deduction/update', updateEstimateDeduction); // ?businessId { newEstimateDeduction, findItemName }
router.post(
  '/business/estimate-deduction/calculate-estimate',
  calculateEstimate
); // ?businessId { itemName, quantity }
calculateEstimate;

//
// Item Location
router.post('/business/item-location/create', createItemLocation); // ?businessId {itemName, locationName}
router.post('/business/item-location/read-all', readAllItemLocationName); // ?businessId { itemName }
router.post('/business/item-location/read-one', readOneItemLocation); // ?businessId { itemName, locationName }
// NOT RECOMMENDED TO DO: DOES NOT UPDATE LOCATION META DATA & LOG
router.post('/business/item-location/update-name', updateItemLocationName); // ?businessId { itemName, findLocationName, newLocationName }
router.post('/business/item-location/delete', deleteItemLocation); // ?businessId { itemName, locationName }
router.post('/business/item-location/get-one-recent-date', getOneRecentDate); // ?businessId { itemName, locationName }
router.post(
  '/business/item-location/total-location-count',
  getTotalLocationCount
); // ?businessId { itemName, locationName }

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
// Location MetaData
router.post('/business/location-metadata-list/create', createLocationMetaData); // ?businessId  { locationName, locationAddress, locationMetaData }
router.post(
  '/business/location-metadata-list/read-all',
  readAllLocationMetaData
); // ?businessId
router.post(
  '/business/location-metadata-list/read-one',
  readOneLocationMetaData
); // ?businessId { locationName }
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
// TODO: Delete all Locations?
router.post('/business/location-metadata-list/delete', deleteLocationMetaData); // ?businessId {locationName}

//
// Distributor Item
router.post('/business/distributor-item/create', createDistributorItem);
// ?businessId  {itemName, distributorName, distributorItemName, distributorItemPortion, distributorItemCost, priorityChoice}
router.post('/business/distributor-item/read-all', readAllDisributorItem); // ?businessId  { itemName }
router.post(
  '/business/distributor-item/update-distributor-item-name',
  updateDistributorItemName
); // ?businessId  { itemName, index, newDistributorItemName }
router.post(
  '/business/distributor-item/update-item-portion',
  updateDistributorItemPortion
); // ?businessId  { itemName, index, newItemPortion }
router.post(
  '/business/distributor-item/update-item-cost',
  updateDistributorItemCost
); // ?businessId  { itemName, index, newItemCost }
router.post(
  '/business/distributor-item/update-priority-choice',
  updateDistributorItemPriorityChoice
); // ?businessId  { itemName, index, newPriorityChoice }
router.post('/business/distributor-item/delete', deleteDistributorItem); // ?businessId { itemName, index }

//
// Distributor MetaData
router.post(
  '/business/distributor-metadata-list/create',
  createDistributorMetaData
); // ?businessId {distributorName,distributorDeadlineDate,distributorDeliveryDate,distributorMetaData}
router.post(
  '/business/distributor-metadata-list/read-all',
  readAllDistributorMetaData
); // ?businessId
router.post(
  '/business/distributor-metadata-list/read-one',
  readOneDistributorMetaData
); // ?businessId {distributorName}
router.post(
  '/business/distributor-metadata-list/update-name',
  updateDistributorMetaDataName
); // ?businessId { findDistributorName, newDistributorName }
router.post(
  '/business/distributor-metadata-list/update-deadline-date',
  updateDistributorMetaDataDeadlineDate
); // ?businessId { findDistributorName, newDistributorDeadlineDate }
router.post(
  '/business/distributor-metadata-list/update-delivery-date',
  updateDistributorMetaDataDeliveryDate
); // ?businessId { findDistributorName, newDistributorDeliveryDate }
router.post(
  '/business/distributor-metadata-list/update-meta-data',
  updateDistributorMetaDataMetaData
); // ?businessId { findDistributorName, newDeliveryMetaData }
// TODO: Delete all Distributor
router.post(
  '/business/distributor-metadata-list/delete',
  deleteDistributorMetaData
); // ?businessId {distributorName}

module.exports = router;
