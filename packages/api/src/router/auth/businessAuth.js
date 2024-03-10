const express = require("express");
const router = express.Router();
const { getDatabase } = require('../database/databaseManager');

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

module.exports = router;
