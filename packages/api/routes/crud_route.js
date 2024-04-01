const router = require('express').Router();

const {
  ReadEmployeeIdList
} = require('../controllers/crud/business_controller');
const {
  doesExistItem,
  createItem,
  readItem,
  updateItem,
  deleteItem
} = require('../controllers/crud/item_list_controller');

const {
  addDistributorMetaData, 
  readDistributorMetaData
} = require('../controllers/crud/distributor_metadata_list_controller')

// Employee Id List Route /crud
router.get('/business/employee-id-list', ReadEmployeeIdList); // /api/auth/business/employeeIdList?id

// Item List Route /crud

router.post('/business/item-list/exist', doesExistItem); // ?businessId&printedFieldNameList
router.post('/business/item-list/create', createItem); // ?businessId&printedFieldNameList
router.post('/business/item-list/read', readItem); // ?businessId&printedFieldNameList
router.post('/business/item-list/update', updateItem); // ?businessId&identityField&identityValue&editField&editValue
router.post('/business/item-list/delete', deleteItem); // ?businessId&identityField&identityValue

// Distributor metadata
router.post('/business/distributor-metadata-list/add', addDistributorMetaData)
router.get('/business/distributor-metadata-list/read', readDistributorMetaData)

module.exports = router;
