const Business = require('../models/business_model');
const User = require('../models/user_model');

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

// Connect User and Business endpoint
module.exports.AddUserBusinessConn = async (req, res, next) => {
  // outgoing: error null, or error connection failed

  try {
    // incoming: userId, businessId
    const { userId, businessId } = req.body;

    // Check if the userId and businessId are provided
    if (!userId || !businessId) {
      return res
        .status(400)
        .json({ error: 'Both userId and businessId are required' });
    }

    // Find the user and business using the DB User and Business models to search
    const user = await User.findById(userId);
    const business = await Business.findById(businessId);

    // Check that they exist
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Add businessId to user's businessIdList
    user.businessIdList.push(businessId);
    await user.save();

    // Add userId to business's employeeIdList
    business.employeeIdList.push(userId);
    await business.save();

    // return success response
    res.status(200).json({ error: null });
  } catch (error) {
    console.error('Error connecting user and business:', error);
    res.status(500).json({ error: 'Connection of Business & User Failed' });
  }
};

// TODO: Add and test
// Remove User and Business endpoint

// TODO: Add and test
// Get business name endpoint
