// Import necessary modules and dependencies
const { User } = require('../../models/user_model');
const GenericCRUDController = require('./generic_crud_controller');

const mongoose = require('mongoose'); // Import mongoose for ObjectId conversion

// Define class that extends the GenericCRUDController class
class EmployeeIdListController extends GenericCRUDController {
  constructor() {
    super(); // Call the constructor of the parent class
  }

  // Method to check if exists
  // Field = employeeIdList, value = employeeId
  async doesExistEmployeeId(businessId, field, value) {
    try {
      // Call the doesExistGeneric method from the parent class
      let doesExist = await super.doesExistGeneric(businessId, field, value);
      return doesExist; // Return the result
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }

  // Method to read all employee IDs associated with the specified business
  // req.query.businessId   req.body is empty
  async readAllEmployeeIds(req, res) {
    try {
      const businessId = req.query.businessId;
      console.log('About to read all employee IDs');
      // Convert business ID to mongoose ObjectId
      let mongooseBusinessID = new mongoose.Types.ObjectId(businessId);

      // Use aggregation to retrieve only the employeeIdList from the specified business
      const fieldValues = await super.readGeneric([
        { $match: { _id: mongooseBusinessID } }, // Match the business ID
        // $unwind not needed because employeeIdList has a different structure
        { $project: { _id: 0, employeeIdList: 1 } } // Project only the employeeIdList field
      ]);
      // req.query.printedFieldName
      return res.status(200).json({ outputList: fieldValues }); // Return success status with employee ID list
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method to delete a specific employee ID from the employeeIdList of the specified business
  // req.query.businessId   // req.body.employeeId
  async deleteEmployeeId(req, res) {
    const businessId = req.query.businessId;
    const { employeeId } = req.body;
    // const employeeId = req.query.employeeId.toString(); // Convert to string
    try {
      console.log('About to delete');
      const businessStatusData = await super.deleteGenericByQuery(
        { _id: businessId },
        { $pull: { employeeIdList: employeeId } }
      );
      const employeeStatusData = await User.updateOne(
        { _id: employeeId },
        { $pull: { businessIdList: businessId } }
      );
      return res
        .status(200)
        .json({ statusDetails: [businessStatusData, employeeStatusData] });
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
