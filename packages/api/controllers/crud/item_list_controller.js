// Rename to business_operations.js?
const {
  Business,
  Item,
  PortionInfo,
  LocationInventory,
  locationBucketLog,
  LocationLog,
  DistributorItem,
  distributorMetaData,
  locationMetaData
} = require('../../models/business_model');
const GenericCRUDController = require('../crud/generic_crud_controller');

const mongoose = require('mongoose');

class ItemListController extends GenericCRUDController {
  constructor() {
    super(Item);
    this.toModel = Item;
    this.BusinessModel = Business;
    this.ItemModel = Item;
    this.PortionInfoModel = PortionInfo;
    this.LocationInventoryModel = LocationInventory;
    this.locationBucketLogModel = locationBucketLog;
    this.LocationLogModel = LocationLog;
    this.DistributorItemModel = DistributorItem;
    this.distributorMetaDataModel = distributorMetaData;
    this.locationMetaDataModel = locationMetaData;
    this.modelObject = null;
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
  async navigateToModel(req, res) {
    try {
      const business = await super.navigateToBusiness(
        this.modelObject,
        req.query.businessId
      );
      if (!business) {
        return null;
      }
      console.log(business.itemList);
      return business.itemList;
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
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
  async read(req, res) {
    try {
      console.log('About to read');
      let mongooseObjectID = new mongoose.Types.ObjectId(req.query.businessId);
      // { $limit: outputSize }, // Project only the name field for each post
      // { $skip: outset } // Project only the name field for each post
      const fieldValues = await super.readGeneric([
        {
          $match: {
            _id: mongooseObjectID
          }
        },
        { $unwind: `$itemList` },
        {
          $match: {
            'itemList.itemName': 'Fluid Item'
          }
        },
        {
          $project: {
            itemName: '$itemList',
            _id: 1
          }
        }
      ]);
      //req.query.printedFieldName
      return res.status(200).json({ list: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.query.printedFieldNameList [Recurring for List]
  async update(req, res) {
    try {
      console.log('About to read');
      // { $limit: outputSize }, // Project only the name field for each post
      // { $skip: outset } // Project only the name field for each post
      const fieldValues = await super.updateGeneric(
        {
          _id: req.query.businessId,
          'itemList.itemName': 'Fluidy Item'
        },
        {
          $set: { 'itemList.$.itemName': 'Fluid Item' }
        }
      );
      //req.query.printedFieldName
      return res.status(200).json({ list: fieldValues });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //req.query.businessId  req.query.identityField req.query.identityValue req.query.editField req.query.editValue
  async updateListOfGenericObject(req, res) {
    try {
      const itemList = await super.navigateToModel(
        this.modelObject,
        req.query.businessId
      );
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.updateListOfGenericObject(
            this.modelObject,
            req.query.identityField,
            req.query.identityValue,
            req.query.editField,
            req.query.editValue
          )
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  // req.query.businessId req.query.identityField req.query.identityValue req.query.editField req.query.editValue
  async updateOneGenericObject(req, res) {
    try {
      const itemList = await super.navigateToModel(
        this.modelObject,
        req.query.businessId
      );
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.updateOneGenericObject(
            this.modelObject,
            req.query.identityField,
            req.query.identityValue,
            req.query.editField,
            req.query.editValue
          )
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  // req.query.businessId req.query.identityField req.query.identityValue
  async deleteListOfGenericObject(req, res) {
    try {
      const itemList = await super.navigateToModel(
        this.modelObject,
        req.query.businessId
      );
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.deleteManyGenericObject(
            this.modelObject,
            req.query.identityField,
            req.query.identityValue
          )
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // req.query.businessId req.query.identityField req.query.identityValue
  async deleteOneGenericObject(req, res) {
    try {
      const itemList = await super.navigateToModel(
        this.modelObject,
        req.query.businessId
      );
      if (!itemList) {
        return res.status(404).json({ error: 'Item List not found' });
      }
      return res
        .status(200)
        .json(
          await super.deleteOneGenericObject(
            this.modelObject,
            req.query.identityField,
            req.query.identityValue
          )
        );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
let itemListController = new ItemListController();
module.exports = {
  navigateToModel: (req, res) => itemListController.navigateToModel(req, res),
  read: (req, res) => itemListController.read(req, res),
  findListOfGenericObject: (req, res) =>
    itemListController.findListOfGenericObject(req, res),
  findOneGenericObject: (req, res) =>
    itemListController.findOneGenericObject(req, res),
  update: (req, res) => itemListController.update(req, res),
  updateOneGenericObject: (req, res) =>
    itemListController.updateOneGenericObject(req, res),
  deleteListOfGenericObject: (req, res) =>
    itemListController.deleteListOfGenericObject(req, res),
  deleteOneGenericObject: (req, res) =>
    itemListController.deleteOneGenericObject(req, res)
};
