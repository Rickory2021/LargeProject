// Rename to business_operations.js?

const { Item } = require('../../models/business_model');
const GenericCRUDController = require('../crud/generic_crud_controller');

class ItemListController extends GenericCRUDController {
  constructor() {
    super(Item);
  }
  // NULL
  // navigateToItem = async () => {
  //   console.log('Item List Controller Not Implemented');
  //   return null;
  //   // try {
  //   //   const item = super.navigateToItem(
  //   //     req.query.businessId,
  //   //     req.query.itemName
  //   //   );
  //   //   if (!item) {
  //   //     return res.status(404).json({ error: 'Item not found' });
  //   //   }
  //   //   return res.status(200).json(item);
  //   // } catch (error) {
  //   //   return res.status(500).json({ error: error.message });
  //   // }
  // };
  // // req.query.businessId
  navigateToModel = async (req, res) => {
    console.log(
      `navigateToModelItemList=>req.query.businessId:${req.query.businessId}`
    );
    try {
      console.log(
        `navigateToModelItemList=>req.query.businessId:${req.query.businessId}`
      );
      const business = await super.navigateToBusiness(req.query.businessId);
      console.log(`navigateToModelItemList=>business:${business}`);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }
      return res.status(200).json(business.itemList);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  // //NULL
  // navigateToBusiness = async () => {
  //   console.log('Item List Controller Not Implemented');
  //   return null;
  // };
  // //NULL
  // createGenericObject = async () => {
  //   console.log('Item List Controller Not Implemented');
  //   return null;
  // };

  //req.query.businessId  req.query.printedFieldNameList [Recurring for List]
  readListOfGenericObject = async (req, res) => {
    try {
      console.log(
        `readListOfGenericObject>ItemList>req.query.businessId:${req.query.businessId}`
      );
      const itemList = await super.navigateToModel(req.query.businessId);
      console.log(req.query.businessId);
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.readListOfGenericObject(req.query.printedFieldNameList)
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  // req.query.businessId req.query.field req.query.value
  findListOfGenericObject = async (req, res) => {
    try {
      const itemList = await super.navigateToModel(req.query.businessId);
      console.log(itemList);
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.findListOfGenericObject(req.query.field, req.query.value)
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  // req.query.businessId req.query.identityField req.query.identityValue
  findOneGenericObject = async (req, res) => {
    try {
      const itemList = await super.navigateToModel(req.query.businessId);
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.findOneGenericObject(
            req.query.identityField,
            req.query.identityValue
          )
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  //req.query.businessId  req.query.identityField req.query.identityValue req.query.editField req.query.editValue
  updateListOfGenericObject = async (req, res) => {
    try {
      const itemList = await super.navigateToModel(req.query.businessId);
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.updateListOfGenericObject(
            req.query.identityField,
            req.query.identityValue,
            req.query.editField,
            req.query.editValue
          )
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  // req.query.businessId req.query.identityField req.query.identityValue req.query.editField req.query.editValue
  updateOneGenericObject = async (req, res) => {
    try {
      const itemList = await super.navigateToModel(req.query.businessId);
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.updateOneGenericObject(
            req.query.identityField,
            req.query.identityValue,
            req.query.editField,
            req.query.editValue
          )
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  // req.query.businessId req.query.identityField req.query.identityValue
  deleteListOfGenericObject = async (req, res) => {
    try {
      const itemList = await super.navigateToModel(req.query.businessId);
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.deleteManyGenericObject(
            req.query.identityField,
            req.query.identityValue
          )
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  // req.query.businessId req.query.identityField req.query.identityValue
  deleteOneGenericObject = async (req, res) => {
    try {
      const itemList = await super.navigateToModel(req.query.businessId);
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.deleteOneGenericObject(
            req.query.identityField,
            req.query.identityValue
          )
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
}
let itemListController = new ItemListController();
module.exports = {
  navigateToModel: (req, res) => itemListController.navigateToModel(req, res),
  readListOfGenericObject: (req, res) =>
    itemListController.readListOfGenericObject(req, res),
  findListOfGenericObject: (req, res) =>
    itemListController.findListOfGenericObject(req, res),
  findOneGenericObject: (req, res) =>
    itemListController.findOneGenericObject(req, res),
  updateListOfGenericObject: (req, res) =>
    itemListController.updateListOfGenericObject(req, res),
  updateOneGenericObject: (req, res) =>
    itemListController.updateOneGenericObject(req, res),
  deleteListOfGenericObject: (req, res) =>
    itemListController.deleteListOfGenericObject(req, res),
  deleteOneGenericObject: (req, res) =>
    itemListController.deleteOneGenericObject(req, res)
};
