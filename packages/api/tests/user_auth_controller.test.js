const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { User } = require('../models/user_model');
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const { Login } = require('../controllers/auth/user_auth_controller');
const { Logout } = require('../controllers/auth/user_auth_controller');

require('dotenv').config();

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('User Authentication Endpoints', () => {
  describe('POST /api/auth/user/signup', () => {
    test('should register a new user', async () => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        username: 'testUser',
        password: 'password',
        email: 'testuser@example.com',
        businessIdList: []
      };

      const response = await request(app)
        .post('/api/auth/user/signup')
        .send(newUser)
        .expect(201);

      expect(response.body.error).toBeNull();
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user).toBeDefined();

      // Add more assertions as needed
      // Ensure the user is saved in the database
      const savedUser = await User.findOne({ email: newUser.email });
      expect(savedUser).toBeDefined();
      expect(savedUser.firstName).toBe(newUser.firstName);
      expect(savedUser.lastName).toBe(newUser.lastName);
      expect(savedUser.username).toBe(newUser.username);
      expect(savedUser.email).toBe(newUser.email);
      expect(savedUser.businessIdList).toEqual(newUser.businessIdList);
    });

    // Add more test cases for different scenarios (e.g., email already in use, missing fields, etc.)
    it('should return error if user already exists', async () => {
      // Create a user with the same email
      const existingUser = new User({
        firstName: 'Existing',
        lastName: 'User',
        username: 'existinguser',
        password: 'password123',
        email: 'existinguser@example.com',
        businessIdList: []
      });
      await existingUser.save();

      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'password123',
        email: 'existinguser@example.com', // Using the same email as existing user
        businessIdList: []
      };

      const response = await request(app)
        .post('/api/auth/user/signup')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('User already exists');
    });
  });

  // Add tests for other endpoints (VerifyEmail, forgotPassword, resetPassword, Login, GetUserInfo, Logout)
  describe('POST /api/auth/user/login', () => {
    test('should login user successfully', async () => {
      const username = 'testUser';
      const password = 'password123';
      const req = mockRequest({ body: { username, password } });
      const res = mockResponse();

      // Mock the findOne method to return a user
      User.findOne = jest.fn().mockResolvedValue({
        _id: 'userId',
        firstName: 'Test',
        lastName: 'User',
        username,
        email: 'testuser@example.com',
        businessIdList: [],
        password: await bcrypt.hash(password, 10), // Hash the password for comparison
        emailVerified: true
      });

      // Execute the Login function
      await Login(req, res);

      // Check if User.findOne was called with the correct username
      expect(User.findOne).toHaveBeenCalledWith({ username });

      // Check if the response status is 200 (OK) and contains the correct user details and access token
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        expect.any(String),
        expect.any(Object)
      );
      expect(res.json).toHaveBeenCalledWith({
        error: null,
        userId: 'userId',
        firstName: 'Test',
        lastName: 'User',
        username: 'testUser',
        email: 'testuser@example.com',
        businessIdList: [],
        accessToken: expect.any(String)
      });
    });
  });

  describe('POST /api/auth/user/logout', () => {
    test('should clear the token cookie and return success message', async () => {
      const req = mockRequest();
      const res = mockResponse();

      // Mock the clearCookie method
      res.clearCookie = jest.fn();

      // Execute the Logout function
      await Logout(req, res);

      // Check if clearCookie was called with the correct cookie name
      expect(res.clearCookie).toHaveBeenCalledWith('token');

      // Check if the response status is 200 (OK) and contains the success message
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ error: null });
    });

    test('should return error if an internal server error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();

      // Mock the clearCookie method to throw an error
      res.clearCookie = jest.fn().mockImplementation(() => {
        throw new Error('Internal server error');
      });

      // Execute the Logout function
      await Logout(req, res);

      // Check if the response status is 500 (Internal Server Error) and contains the error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  // other
});
