class CRUDController {
    constructor(model) {
      this.model = model;
    }
  
    create = async (req, res) => {
      try {
        const newItem = new this.model(req.body);
        await newItem.save();
        res.status(201).send(newItem);
      } catch (error) {
        res.status(400).send(error);
      }
    };
  
    findAll = async (req, res) => {
      try {
        const items = await this.model.find({});
        res.send(items);
      } catch (error) {
        res.status(500).send(error);
      }
    };
  
    update = async (req, res) => {
      try {
        const item = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) {
          return res.status(404).send();
        }
        res.send(item);
      } catch (error) {
        res.status(400).send(error);
      }
    };
  
    delete = async (req, res) => {
      try {
        const item = await this.model.findByIdAndDelete(req.params.id);
        if (!item) {
          return res.status(404).send();
        }
        res.send(item);
      } catch (error) {
        res.status(500).send(error);
      }
    };
  }
  
module.exports = CRUDController;
  