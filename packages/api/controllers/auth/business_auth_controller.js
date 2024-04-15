const { Business } = require('../../models/business_model');
const { User } = require('../../models/user_model');

/**
 * Register Business endpoint\
 * - Creates the new User Account (No Connection)
 * @param {Request} req Incoming: JSON {businessName}
 * @param {Result} res The Express response object.
 * @returns \{error:null, businessId} || {error: 'Business name is required'} || {error:'Internal Server Error'}
 */
module.exports.RegisterBusiness = async (req, res) => {
  try {
    const { businessName } = req.body;

    // Validate input
    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    // Create a new business object
    let newBusiness = new Business({
      businessName: businessName
    });

    // Save the new business to the database
    await newBusiness.save();

    // Return a success response
    res.status(201).json({ error: null, businessId: newBusiness.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Connect the User Id & Business Id\
 * - User Id will be added to Business's employeeIdList\
 * - Business Id will be added to User's businessIdList
 * @param {Request} req  - Incoming: JSON{userId, businessId}
 * @param {Result} res - The Express response object
 * @returns \{error:null} || {error:'Both userId and/or businessId are required'} || {error:'User not found'} || {error:'Business not found'}
 */
module.exports.AddUserBusinessConn = async (req, res) => {
  try {
    const { userId, businessId } = req.body;

    // Check if the userId and businessId are provided
    if (!userId || !businessId) {
      return res
        .status(400)
        .json({ error: 'Both userId and/or businessId are required' });
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
    res.status(500).json({ error: 'Connection of Business & User Failed' });
  }
};

/**
 * Remove User and Business Connection endpoint\
 * - User Id will be removed from Business's employeeIdList\
 * - Business Id will be removed from User's businessIdList
 * @param {Request} req  - Incoming: JSON{userId, businessId}
 * @param {Result} res - The Express response object
 * @returns \{error:null} || {error:'Both userId and/or businessId are required'} || {error:'User not found'} || {error:'Business not found'} || {error:'Removal of Business & User Connection Failed'}
 */
module.exports.RemoveUserBusinessConn = async (req, res) => {
  try {
    const { userId, businessId } = req.body;

    // Check if userId and businessId are provided
    if (!userId || !businessId) {
      return res
        .status(400)
        .json({ error: 'Both userId and businessId are required' });
    }

    // Find the user and business by their IDs
    const user = await User.findById(userId);
    const business = await Business.findById(businessId);

    // Check if user and business exist
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Remove businessId from user's businessIdList
    const businessIndex = user.businessIdList.indexOf(businessId);
    if (businessIndex !== -1) {
      user.businessIdList.splice(businessIndex, 1);
      await user.save();
    }

    // Remove userId from business's employeeIdList
    const userIndex = business.employeeIdList.indexOf(userId);
    if (userIndex !== -1) {
      business.employeeIdList.splice(userIndex, 1);
      await business.save();
    }

    // Return success response
    res.status(200).json({ error: null });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Removal of Business & User Connection Failed' });
  }
};

/**
 * Get Business Name endpoint\
 * @param {Request} req  - Incoming: QUERY ?businessId
 * @param {Result} res - The Express response object
 * @returns \{error:null, businessName} || {error:'Business ID is required'} || {error:'Business not found'} || {error:'Business Name Fetch Failed'}
 */
module.exports.GetBusinessName = async (req, res) => {
  try {
    // Incoming: business_id
    const businessId = req.query.businessId;

    // Check if business_id is provided
    if (!businessId) {
      return res.status(400).json({ error: 'Business ID is required' });
    }

    // Find the business by its ID
    const business = await Business.findById(businessId);

    // Check if business exists
    if (!business) {
      return res
        .status(404)
        .json({ businessName: null, error: 'Business not found' });
    }

    // Return the business name
    res.status(200).json({ businessName: business.businessName, error: null });
  } catch (error) {
    res
      .status(500)
      .json({ businessName: null, error: 'Business Name Fetch Failed' });
  }
};
