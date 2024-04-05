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
  addDistributorMetaData,
  readDistributorMetaData,
  updateDistributorMetaData,
  deleteDistributorMetaData
} = require('../controllers/crud/distributor_metadata_list_controller');

// Employee Id List Route /crud
router.get('/business/employee-id-list/read-all', readAllEmployeeIds); //GET /api/crud/business/employee-id-list/read-all?businessId=

// Item List Route /crud
router.post('/business/item-list/create', createItem); // ?businessId&itemName
router.post('/business/item-list/read-all', readAllItemName); // ?businessId
router.post('/business/item-list/read-one', readOneItem); // ?businessId&itemName
router.post('/business/item-list/update', updateItem); // ?businessId&findItemName&newItemName
router.post('/business/item-list/delete', deleteItem); // ?businessId&&itemName

// Distributor metadata
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

// Location MetaData List Route /crud

module.exports = router;
