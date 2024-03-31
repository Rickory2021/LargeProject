const router = require('express').Router();

const {
  ReadEmployeeIdList
} = require('../controllers/crud/business_controller');
const {
  readListOfGenericObject,
  findListOfGenericObject,
  findOneGenericObject,
  updateListOfGenericObject,
  updateOneGenericObject,
  deleteListOfGenericObject,
  deleteOneGenericObject
} = require('../controllers/crud/item_list_controller');

// Employee Id List Route /crud
router.get('/business/employee-id-list', ReadEmployeeIdList); // /api/auth/business/employeeIdList?id

// Item List Route /crud
router.post('/business/item-list/read-list', readListOfGenericObject); // ?businessId&printedFieldNameList
router.post('/business/item-list/find-list', findListOfGenericObject); // ?businessId&printedFieldNameList
router.post('/business/item-list/find-one', findOneGenericObject); // ?businessId&identityField&identityValue
router.post('/business/item-list/update-list', updateListOfGenericObject); // ?businessId&identityField&identityValue&editField&editValue
router.post('/business/item-list/update-one', updateOneGenericObject); // ?businessId&identityField&identityValue&editField&editValue
router.post('/business/item-list/delete-list', deleteListOfGenericObject); // ?businessId&identityField&identityValue
router.post('/business/item-list/delete-one', deleteOneGenericObject); // ?businessId&identityField&identityValue

module.exports = router;
