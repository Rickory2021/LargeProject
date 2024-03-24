// TODO: delete commented out 'consts' below - not being used
// const express = require('express');
// const router = express.Router();
// const { getDatabase } = require('../database/database_manager');
const Business = require('../models/business_model');

// Register Business endpoint
module.exports.RegisterBusiness = async (req, res, next) => {
  try {
    // incoming: businessName
    // outgoing: businessId, error null

    // Extract required information from request body
    const { businessName } = req.body;

    // Validate input
    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    // Create a new business object
    const newBusiness = new Business({
      businessName: businessName,
      employeeIdList: [],
      itemList: [],
      distributorList: [],
      locationList: []
    });

    // Save the new business to the database
    await newBusiness.save();
    // TODO: Delete?
    /*    // For debugging purposes
      .then(savedUser => {
        console.log('User saved successfully:', savedUser);
        console.log(`Database Loc: ${getDatabase}`);
      })
      .catch(error => {
        if (error.errors) {
          console.error('Validation errors:', error.errors);
        } else {
          console.error('Error saving user:', error);
        }
      });
      */

    // Return a success response
    res.status(201).json({ error: null, business: newBusiness });
  } catch (error) {
    // TODO: Delete?
    // console.error('Error registering business:', error);     // For debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// TODO: Add and test
// Connect User and Business endpoint

// TODO: Add and test
// Remove User and Business endpoint
