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
    const businessId = req.query.businessId;
    const employeeId = req.query.employeeId.toString(); // Convert to string
    try {
      const statusData = await super.deleteGenericByQuery(
        {
          _id: businessId
        },
        {
          $pull: {
            employeeIdList: employeeId
          }
        }
      );
      return res.status(200).json({ statusDetails: [statusData] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
