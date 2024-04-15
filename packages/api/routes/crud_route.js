const router = require('express').Router();

const {
  ReadEmployeeIdList
} = require('../controllers/crud/business_controller');
const {
  createItem,
  readAllItemName,
  readOneItem,
  updateItem,
  deleteItem
} = require('../controllers/crud/item_controller');

// Employee Id List Route /crud
router.get('/business/employee-id-list', ReadEmployeeIdList); // /api/auth/business/employeeIdList?id

// Item List Route /crud

router.post('/business/item-list/create', createItem); // ?businessId&itemName
router.post('/business/item-list/read-all', readAllItemName); // ?businessId
router.post('/business/item-list/read-one', readOneItem); // ?businessId&itemName
router.post('/business/item-list/update', updateItem); // ?businessId&findItemName&newItemName
router.post('/business/item-list/delete', deleteItem); // ?businessId&&itemName

module.exports = router;
