const { Signup } = require('../controllers/user_auth_controller');
const { Login } = require('../controllers/user_auth_controller');
const { Logout } = require('../controllers/user_auth_controller');
const { RegisterBusiness } = require('../controllers/business_auth_controller');
const { userVerification } = require('../middlewares/auth_middleware');
// TODO: Uncomment when making these endpoints
// const { AddUserBusinessConn } = require("../Controllers/BusinessAuthController");
// const { RemoveUserBusinessConn } = require("../Controllers/BusinessAuthController");
const router = require('express').Router();

// User routes
router.post('/user/signup', Signup);
router.post('/user/login', Login);
router.post('/user/logout', Logout);

// Home route
router.post('/', userVerification);

// Business routes
router.post('/business/register', RegisterBusiness);
// TODO: Uncomment when making these endpoints
// router.post('/business/addConnection', AddUserBusinessConn);
// router.post('/business/removeConnection', RemoveUserBusinessConn);

module.exports = router;
