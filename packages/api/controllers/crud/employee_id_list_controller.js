// Import necessary modules and dependencies
const { Business } = require('../../models/business_model'); // Import the Business model
const GenericCRUDController = require('./generic_crud_controller'); // Import the GenericCRUDController

const mongoose = require('mongoose'); // Import mongoose for ObjectId conversion

// Define the EmployeeIdListController class that extends the GenericCRUDController class
class EmployeeIdListController extends GenericCRUDController {
  constructor() {
    super(); // Call the constructor of the parent class
  }

  // Method to check if an employee ID exists in the employeeIdList of the specified business
  async doesExistEmployeeId(businessId, employeeId) {
    try {
      // Call the doesExistGeneric method from the parent class
      let doesExist = await super.doesExistGeneric(
        businessId,
        'employeeIdList',
        employeeId
      );
      return doesExist; // Return the result
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  // Method to read all employee IDs associated with the specified business
  async readAllEmployeeIds(req, res) {
    try {
      console.log('About to read all employee IDs');
      // Convert business ID to mongoose ObjectId
      let mongooseBusinessID = new mongoose.Types.ObjectId(
        req.query.businessId
      );

      // Use aggregation to retrieve only the employeeIdList from the specified business
      const fieldValues = await super.readGeneric([
        { $match: { _id: mongooseBusinessID } }, // Match the business ID
        { $project: { _id: 0, employeeIdList: 1 } } // Project only the employeeIdList field
      ]);

      return res.status(200).json({ fieldValues }); // Return success status with employee ID list
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method to delete a specific employee ID from the employeeIdList of the specified business
  async deleteEmployeeId(req, res) {
    try {
      console.log('About to delete');
      const employeeIdString = req.query.employeeId.toString(); // Convert to string

      console.log('checkString:', employeeIdString);
      console.log('employeeId:', typeof employeeIdString);
      // Call the deleteGeneric method from the parent class to delete the employee ID
      const statusData = await super.deleteGeneric(
        req.query.businessId,
        'employeeIdList',
        // 'employeeId', // Make sure 'employeeId' is passed as fieldToCheck
        // null,
        req.query.employeeId
      );
      return res.status(200).json({ status: statusData }); // Return success status with status data
    } catch (error) {
      return res.status(500).json({ error: error.message }); // Return error status with error message
    }
  }
}

// Instantiate the EmployeeIdListController
let employeeIdListController = new EmployeeIdListController();

// Export the methods of the EmployeeIdListController for use in other modules
module.exports = {
  readAllEmployeeIds: (req, res) =>
    employeeIdListController.readAllEmployeeIds(req, res),
  deleteEmployeeId: (req, res) =>
    employeeIdListController.deleteEmployeeId(req, res)
};

/**
 * Read all employee id’s and read just one
 * CRUD employeeIdList(Create[Defaulted] Read[List of ID Strings) & Add[Is just Create & Delete] &
 * Delete [Delete a ID String])
 * employeeId(Create  [add Business & User ID], Read[List of ID Strings), Delete [remove Business & User ID] )
 */
