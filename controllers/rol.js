// Modelos
const Rol = require('../models/rol');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');


// 0. Funcion de prueba del controlador
function rol(req, res) {
    res.status(200).send({ msg: 'Controlador de roles funcionando' });
}
// 1. Guardar un rol
async function saveRol(req, res) {
    const payload = {
        requiredFields: ['name', 'company', 'application'],
        requestData: req.body,
        collection: Rol,
        successMessage: 'Rol guardado con exito',
        errorMessage: `Error guardando rol`
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener Roles
async function getRoles(req, res) {
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Rol,
        query: query,
        sort: req.query.sort ? req.query.sort : '-updatedAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        requiredFields: ['name', 'company', 'application'],
        populateFields: [
            {
                path: 'company',
                select: { _id: 1, name: 1, profileImage: 1}
            },
            {
                path: 'application',
                select: { _id: 1, name: 1}
            }
        ],
        successMessage: 'Roles encontrados con exito',
        errorMessage: 'Error buscando roles'
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Buscar un rol
async function findRol(req, res) {
    const payload = {
        id: req.params.id,
        collection: Rol,
        unselectFields: ['__v'],
        populateFields: [{
                path: 'company',
                select: { name: 1, _id: 1 }
            },
            {
                path: 'permissions',
                select: { name: 1, _id: 1 }
            },
            {
                path: 'locals',
                select: { name: 1, _id: 1 }
            }
        ],
        successMessage: 'Rol encontrado con exito',
        errorMessage: `Error buscando rol, el rol con id ${req.params.id} no existe`
    }
    try {
        const resp = await dataBase.findCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Actualizar rol
async function updateRol(req, res) {
    const payload = {
        id: req.params.id,
        collection: Rol,
        requestData: req.body,
        successMessage: 'Rol actualizado con exito',
        errorMessage: 'Error actualizando rol'
    }
    try {
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 5. Borrar rol
async function removeRol(req, res) {
    const payload = {
        id: req.params.id,
        collection: Rol,
        successMessage: 'Rol eliminado con exito',
        errorMessage: 'Error eliminando rol'
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 6. Obtener administradores buscador
async function simpleSearch(req, res) {
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Rol,
        query: query,
        unselectFields: ['__v', 'password'],
        sort: req.query.sort ? req.query.sort : '-updatedAt',
        successMessage: 'Roles encontrados con exito',
        errorMessage: 'Error buscando roles'
    }
    try {
        const resp = await dataBase.simpleSearch(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    rol,
    saveRol,
    getRoles,
    findRol,
    updateRol,
    removeRol,
    simpleSearch
}