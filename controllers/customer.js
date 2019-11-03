const Customer = require("../models/customer");
const CustomerInformation = require("../models/information");
const dataBase = require("../services/dataBaseMethods");
const fileMethods = require("../services/fileMethods");
const path = require("path");
const queryMethods = require("../services/query");

// 0. Customer controller
function customer(req, res) {
  res.status(200).send({ msg: "Customer controller works" });
}

// 1. Save customer
async function saveCustomer(req, res) {
  try {
    const respCustomer = await dataBase.saveCollection({
      repeatedFieldsOr: ["email"],
      requestData: req.body,
      collection: Customer
    });
    const customerInformation = await dataBase.saveCollection({
      requestData: req.body,
      collection: CustomerInformation
    });
    respCustomer.data.customerInformation = customerInformation.data._id;
    const resp = await dataBase.saveCollection({
      id: respCustomer.data._id,
      collection: Customer,
      requestData: respCustomer.data
    });
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 2. Get customers
async function getCustomers(req, res) {
  const payload = {
    collection: Customer,
    query: req.query.query,
    sort: req.query.sort,
    pagination: req.query.pagination,
    unselectFields: ["__v"],
    populateFields: req.query.populate
  };
  try {
    const resp = await dataBase.findCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 3. Get customer
async function findCustomer(req, res) {
  const payload = {
    id: req.params.id,
    collection: Customer,
    unselectFields: ["__v"],
    populateFields: req.query.populate
  };
  try {
    const resp = await dataBase.findByIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 4. Put customer
async function updateCustomer(req, res) {
  const payload = {
    id: req.params.id,
    collection: Customer,
    requestData: req.body,
    files: req.files,
    type: "IMAGE_CUSTOMER",
    fieldToEdit: "profileImage"
  };
  try {
    const resp = await dataBase.updateIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 5. Delete customer
async function removeCustomer(req, res) {
  const payload = {
    id: req.params.id,
    collection: Customer,
    fieldToEdits: ["profileImage"]
  };
  try {
    const resp = await dataBase.deleteIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 6. Get image customer
async function getImage(req, res) {
  const payload = {
    id: req.params.id,
    fileName: req.params.file,
    path: "uploads/customer"
  };
  try {
    const resp = await fileMethods.getFile(payload);
    return res.sendFile(path.resolve(resp.url));
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

module.exports = {
  customer,
  saveCustomer,
  getCustomers,
  findCustomer,
  updateCustomer,
  removeCustomer,
  getImage
};
