const Company = require("../models/company");
const dataBase = require("../services/dataBaseMethods");
const fileMethods = require("../services/fileMethods");
const path = require("path");

// 0. Company controller
function company(req, res) {
  res.status(200).send({ msg: "Company controller works" });
}

// 1. Save company
async function saveCompany(req, res) {
  const payload = {
    repeatedFieldsAnd: ["name", "application"],
    requestData: req.body,
    collection: Company
  };
  try {
    const resp = await dataBase.saveCollection(payload);
    return res.status(200).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 2. Find companies
async function getCompanies(req, res) {
  const payload = {
    collection: Company,
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

// 3. Update company
async function updateCompany(req, res) {
  const payload = {
    id: req.params.id,
    collection: Company,
    requestData: req.body,
    files: req.files,
    type: "IMAGE_COMPANY",
    fieldToEdit: "profileImage"
  };
  try {
    const resp = await dataBase.updateIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 4. Delete company
async function removeCompany(req, res) {
  const payload = {
    id: req.params.id,
    collection: Company,
    fieldToEdits: ["profileImage", "logo"]
  };
  try {
    const resp = await dataBase.deleteIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 5. Get images
async function getImage(req, res) {
  const payload = {
    id: req.params.id,
    fileName: req.params.file,
    path: "uploads/company/image"
  };
  try {
    const resp = await fileMethods.getFile(payload);
    return res.sendFile(path.resolve(resp.url));
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 6. Get company
async function findCompany(req, res) {
  const payload = {
    id: req.params.id,
    collection: Company,
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

// 7. Save company images
async function saveCompanyImages(req, res) {
  try {
    const payload = {
      id: req.params.id,
      files: req.files,
      collection: Company,
      type: "IMAGE_COMPANY",
      fieldToEdit: "profileImage"
    };
    const resp = await dataBase.saveFiles(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

module.exports = {
  company,
  saveCompany,
  updateCompany,
  removeCompany,
  getCompanies,
  getImage,
  findCompany,
  saveCompanyImages
};
