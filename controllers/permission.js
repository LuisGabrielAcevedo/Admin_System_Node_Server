// Modelos
const Permission = require('../models/permission');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Permission data
const permissionData = require('../data/permission');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');
// Libreria para registrar momento
const moment = require('moment');


// 0. Funcion de prueba del controlador
function permission(req, res) {
    res.status(200).send({ msg: 'Controlador de permisos para las aplicaciones funcionando' });
}
// 1. Guardar un permiso
async function savePermission(req, res) {
    const payload = {
        requiredFields: ['name', 'description', 'module'],
        repeatedFields: ['name'],
        requestData: req.body,
        collection: Permission
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener permisos
async function getPermissions(req, res) {
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Permission,
        query: query,
        sort: req.query.sort ? req.query.sort : '-updatedAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        requiredFields: ['name', 'description', 'module']
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Buscar Permisos
async function findPermission(req, res) {
    const payload = {
        id: req.params.id,
        collection: Permission,
        unselectFields: ['__v']
    }
    try {
        const resp = await dataBase.findCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 4. Actualizar permiso
async function updatePermission(req, res) {
    const payload = {
        id: req.params.id,
        collection: Permission,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 5. Borrar un permiso
async function removePermission(req, res) {
    const payload = {
        id: req.params.id,
        collection: Permission
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 6. Atualizar permisos automaticamente
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
            })
        })
    });
    return res.status(200).send({
        status: 'OK',
        code: 200,
        msg: 'Permisos actualizados'
    });
}

// 7. Obtener administradores buscador
async function simpleSearch(req, res) {
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Permission,
        query: query,
        unselectFields: ['__v', 'password'],
        sort: req.query.sort ? req.query.sort : '-updatedAt',
        successMessage: 'Permisos encontrados con exito',
        errorMessage: 'Error buscado permisos'
    }
    try {
        const resp = await dataBase.simpleSearch(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 8. Actualizar varios permisos
async function updateManyPermissions(req, res) {
    const payload = {
        collection: Permission,
        ids: req.body.permissions,
        requestData: { applications: req.body.applications }
    }
    try {
        const resp = await dataBase.updateManyIds(payload);
        return res.status(resp.code).send(resp)
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
    removePermission,
    updatePermissions,
    simpleSearch,
    updateManyPermissions
}