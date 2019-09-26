const Permission = require("../models/permission");
const dataBase = require("../services/dataBaseMethods");
const permissionData = require("../data/permissions");
const moment = require("moment");

// 0. Permission controller
function permission(req, res) {
  res.status(200).send({ msg: "Permission controller works" });
}
// 1. Save permission
async function savePermission(req, res) {
  const payload = {
    repeatedFieldsOr: ["name"],
    requestData: req.body,
    collection: Permission
  };
  try {
    const resp = await dataBase.saveCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 2. Get permissions
async function getPermissions(req, res) {
  const payload = {
    collection: Permission,
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

// 3. Get permission
async function findPermission(req, res) {
  const payload = {
    id: req.params.id,
    collection: Permission,
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

// 4. Update permission
async function updatePermission(req, res) {
  const payload = {
    id: req.params.id,
    collection: Permission,
    requestData: req.body
  };
  try {
    const resp = await dataBase.updateIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 5. Delete permission
async function deletePermission(req, res) {
  const payload = {
    id: req.params.id,
    collection: Permission
  };
  try {
    const resp = await dataBase.deleteIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 6. Create permissions
async function updatePermissions(req, res) {
  permissionData.forEach(item => {
    item.permissions.forEach(name => {
      Permission.find({ name: name }).exec((err, dataBaseResp) => {
        if (err) console.log(`Error verificando permiso: ${name}`);
        if (dataBaseResp.length === 0) {
          let permissionToSave = new Permission();
          permissionToSave.name = name;
          permissionToSave.module = item.module;
          permissionToSave.actionType = item.actionType;
          permissionToSave.createdAt = moment().toISOString();
          permissionToSave.updatedAt = moment().toISOString();
          permissionToSave.save((err, dataBaseResp1) => {
            if (err) {
              console.log(`Error creando permiso: ${name}`);
            } else {
              console.log(`Permiso: ${name} creado`);
            }
          });
        }
      });
    });
  });
  return res.status(200).send({
    status: "OK",
    code: 200,
    msg: "Permisos actualizados"
  });
}

// 7. Update many permissions
async function updateManyPermissions(req, res) {
  const payload = {
    collection: Permission,
    ids: req.body.permissions,
    requestData: { applications: req.body.applications }
  };
  try {
    const resp = await dataBase.updateManyIds(payload);
    return res.status(resp.code).send(resp);
  } catch (e) {
    return res.status(err.code).send(err);
  }
}

module.exports = {
  permission,
  savePermission,
  getPermissions,
  findPermission,
  updatePermission,
  deletePermission,
  updatePermissions,
  updateManyPermissions
};
