const express = require("express");
const router = express.Router();
const { getDatabase } = require('../database/databaseManager');

// Register business 
router.post("/register", async (req, res, next) => {
    // incoming: businessName
    // outgoing: businessId, error
  
    // Init. error var
    var error = "";
    const { businessName } = req.body;
  
    // Connect to database
    const db = getDatabase()
  
    try {

      // Create a new business object
      const result = await db.collection("businesses").insertOne({
        businessName: businessName,
        employeeIdList: [],
        itemList: [],
        distributorList: [],
        locationList: []
      });
  
      // Extract the inserted business ID
      const businessId = result.insertedId;
  
      // Return the business ID and no error
      return res.status(200).json({ businessId, error: "" });
    } 
    catch (error) {
      console.error("Error during business registration:", error);
  
      // Return an empty business ID and an error message
      return res.status(500).json({ businessId: "", error: "Unknown Error" });
    }
  });

// userBusinessConnection 
// Connect user and business 
router.post("/connect", async (req, res, next) => {
  
  // Incoming : userId ,businessId 
  // Outgoing: success, error 

  const { userId, businessId } = req.body; 

  // connect to the database 
  const db = getDatabase();

  try {

    // Update the user document with the businessId 
    const userUpdateResult = await db.collection("users").updateOne(
      { _id: userId }, 
      { $addToSet: { businessIdList: businessId} }
      // adds elements to an array only if not already present 
    );

    // Update the business document with the userId 
    const businessUpdateResult = await db.collection("business").updateOne(
      { _id: businessId}, 
      { $addToSet: { employeeIdList: userId} }  
      // adds elements to an array only if not already present 
    );

    // Check if both updates were successful 
    if (userUpdateResult.modifiedCount == 1 && businessUpdateResult.modifiedCount == 1) {
      return res.status(200).json({ error: " "});
    } 
    else {
      return res.status(500).json({ error: "Failed to update user or business."});
    }

  }

  catch (error) {
    console.error("Error during user-business connection: ", error);
    return res.status(500). json({ success: false, error: "Internal Server Error"});
  }
});

module.exports = router;
