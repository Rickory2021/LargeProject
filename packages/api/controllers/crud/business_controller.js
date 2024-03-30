// Rename to business_operations.js?

const Business = require('../../models/business_model');
const CRUDController = require('../controllers/crud_controller');

class BusinessController extends CRUDController {
  constructor() {
    super(Business);
  }

  async ReadEmployeeIdList(req, res) {
    try {
      const { id } = req.query;

      const business = await this.model.findById(id).select('employeeIdList');
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }
      res.status(200).json(business.employeeIdList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

const businessController = new BusinessController();
module.exports = {
  ReadEmployeeIdList: (req, res) =>
    businessController.ReadEmployeeIdList(req, res)
};
