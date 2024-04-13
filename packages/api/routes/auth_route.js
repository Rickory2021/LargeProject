const {
  Signup,
  VerifyEmail,
  Login,
  Logout,
  GetUserInfo,
  forgotPassword,
  resetPassword
} = require('../controllers/auth/user_auth_controller');
const {
  RegisterBusiness,
  AddUserBusinessConn,
  RemoveUserBusinessConn,
  GetBusinessName
} = require('../controllers/auth/business_auth_controller');
const {
  userVerification
} = require('../controllers/auth/middlewares/auth_middleware_controller');
const router = require('express').Router();

// User routes /api/auth
router.post('/user/signup', Signup); // POST /api/auth/user/signup
router.post('/user/verify-email', VerifyEmail); // POST /api/auth/user/verify-email?token
router.post('/user/login', Login); // POST /api/auth/user/signup
router.post('/user/logout', Logout); // POST /api/auth/user/logout
router.get('/user/user-info', GetUserInfo); // GET /api/auth/user/user-info?id
router.post('/user/forgot-password', forgotPassword); // POST /api/auth/user/forgot-password
router.post('/user/reset-password', resetPassword); // POST /api/auth/user/reset-password?token

// Home route /api/auth
router.post('/:accessToken', userVerification); // POST /api/auth/sdasjcbweqioqiudbbd

// Business routes /api/auth
router.post('/business/register', RegisterBusiness); // POST /api/auth/business/register
router.post('/business/add-connection', AddUserBusinessConn); // POST /api/auth/business/add-connection
router.post('/business/remove-connection', RemoveUserBusinessConn); // POST /api/auth/business/remove-connection
router.get('/business/business-name', GetBusinessName); // GET /api/auth/business/business-name?businessId

module.exports = router;
