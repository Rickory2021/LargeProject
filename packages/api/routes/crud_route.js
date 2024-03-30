const router = require('express').Router();

const {
    ReadEmployeeIdList
  } = require('../src/router/crud/business_controller');


router.get('/business/employeeIdList', ReadEmployeeIdList);

module.exports = router;
