const router = require('express').Router();

const {
  ReadEmployeeIdList
} = require('../controllers/crud/business_controller');

// Employee Id List Route /api/auth
router.get('/business/employeeIdList', ReadEmployeeIdList); // /api/auth/business/employeeIdList?id

module.exports = router;
