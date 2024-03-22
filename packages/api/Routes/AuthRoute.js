const { Signup } = require('../Controllers/UserAuthController');
const { Login } = require('../Controllers/UserAuthController');
const { Logout } = require('../Controllers/UserAuthController');
const { RegisterBusiness } = require('../Controllers/BusinessAuthController');
const { userVerification } = require('../Middlewares/AuthMiddleware');
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
