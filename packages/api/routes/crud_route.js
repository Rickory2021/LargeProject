const router = require('express').Router();

const {
  readAllEmployeeIds
} = require('../controllers/crud/employee_id_list_controller');

const {
  createItem,
  readAllItemName,
  readOneItem,
  updateItem,
  deleteItem
} = require('../controllers/crud/item_controller');

const {
  createPortionInfo,
  readAllPortionInfo,
  updatePortionInfoName,
  updatePortionInfoNumber,
  deletePortionInfo
} = require('../controllers/crud/portion_info_controller');

const {
  addDistributorMetaData,
  readDistributorMetaData,
  updateDistributorMetaData,
  deleteDistributorMetaData
} = require('../controllers/crud/distributor_metadata_list_controller');

const {
  addLocationMetaData,
  readLocationMetaData,
  updateLocationMetaData,
  deleteLocationMetaData
} = require('../controllers/crud/location_metadata_list_controller');

// Employee Id List Route /crud
router.get('/business/employee-id-list/read-all', readAllEmployeeIds); //GET /api/crud/business/employee-id-list/read-all?businessId=

// Item List Route /crud
router.post('/business/item-list/create', createItem); // ?businessId {itemName}
router.post('/business/item-list/read-all', readAllItemName); // ?businessId
router.post('/business/item-list/read-one', readOneItem); // ?businessId {itemName}
router.post('/business/item-list/update', updateItem); // ?businessId {findItemName, newItemName}
router.post('/business/item-list/delete', deleteItem); // ?businessId {itemName}

// Portion List Infor
router.post('/business/portion-info-list/create', createPortionInfo); // ?businessId&itemName {unitName,unitNumber}
router.post('/business/portion-info-list/read-all', readAllPortionInfo); // ?businessId  {itemName}
router.post('/business/portion-info-list/update-name', updatePortionInfoName); // ?businessId&itemName {findUnitName,c}
router.post(
  '/business/portion-info-list/update-number',
  updatePortionInfoNumber
); // ?businessId&findItemName&newItemName
router.post('/business/portion-info-list/delete', deletePortionInfo); // ?businessId&&itemName {unitName}

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

// Location MetaData
router.post('/business/location-metadata-list/add', addLocationMetaData)
router.get('/business/location-metadata-list/read', readLocationMetaData)
router.post('/business/location-metadata-list/update', updateLocationMetaData)
router.post('/business/location-metadata-list/delete', deleteLocationMetaData)

module.exports = router;
