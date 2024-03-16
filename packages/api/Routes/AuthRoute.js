const { Signup } = require("../Controllers/UserAuthController");
const { Login } = require("../Controllers/UserAuthController");
const { Logout } = require("../Controllers/UserAuthController");
const { RegisterBusiness } = require("../Controllers/BusinessAuthController");
// TODO: Uncomment when making these endpoints 
// const { AddUserBusinessConn } = require("../Controllers/BusinessAuthController");
// const { RemoveUserBusinessConn } = require("../Controllers/BusinessAuthController");
const router = require("express").Router();

// User routes 
router.post("/signup", Signup);
router.post('/login', Login);
router.post('/logout', Logout);

// Business routes 
router.post('/register', RegisterBusiness);
// TODO: Uncomment when making these endpoints 
// router.post('/addConnection', AddUserBusinessConn);
// router.post('/removeConnection', RemoveUserBusinessConn);

module.exports = router;