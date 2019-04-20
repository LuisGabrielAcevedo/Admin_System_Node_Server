// models
const License = require('../models/license');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Metodos para manejar archivos
const fileMethods = require('../services/fileMethods');
// Libreria para trabajar con ficheros
const path = require('path');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');

// 0. Funcion de prueba del controlador
function license(req, res) {
    res.status(200).send({ msg: 'Controlador de Licencias funcionando' })
}
// 1. Guardar licencia
async function saveLicense(req, res) {
    const payload = {
        requiredFields: ['code', 'company', 'expirateAt'], //required
        repeatedFields: ['code'],
        requestData: req.body,
        collection: License,
        successMessage: 'Licencia guardada con exito',
        errorMessage: `Error guardando Licencia`
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(200).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener licencias
async function getLicenses(req, res) {
    const searchFields = ['expirateAt', 'code'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};

    const payload = {
        collection: License,
        query: query,
        sort: req.query.sort ? req.query.sort : 'createdAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v', 'password'],
        populateFields: [{ //son objectos
                path: 'company',
            },
            { //son  objectos
                path: 'admin',
            },
        ],
        successMessage: 'Licencias encontrados con exito',
        errorMessage: 'Error buscado Licencias'
    };
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Borrar una licencia
async function removeLicense(req, res) {
    const payload = {
        id: req.params.id,
        collection: License,
        successMessage: 'Licencia eliminada con exito',
        errorMessage: 'Error eliminando Licencia'
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Buscar licencia
async function findLicenses(req, res) {
    const payload = {
        id: req.params.id,
        collection: License,
        unselectFields: ['__v'],
        successMessage: 'Licencia encontrado con exito',
        errorMessage: `Error buscando Licencia, el Licencia con id ${req.params.id} no existe`
    }
    try {
        const resp = await dataBase.findCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 5. Actualizar una licencia
async function updateLicense(req, res) {
    const payload = {
        id: req.params.id,
        collection: License,
        requestData: req.body,
        successMessage: 'Licencia actualizado con exito',
        errorMessage: 'Error actualizando Licencia'
    }
    try {
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 6. Obtener licencias buscador
async function simpleSearch(req, res) {
    const searchFields = ['code'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: License,
        query: query,
        unselectFields: ['__v'],
        sort: req.query.sort ? req.query.sort : 'createdAt',
        successMessage: 'Licencias encontrados con exito',
        errorMessage: 'Error buscado Licencias'
    }
    try {
        const resp = await dataBase.simpleSearch(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    license,
    saveLicense,
    getLicenses,
    removeLicense,
    findLicenses,
    updateLicense,
    simpleSearch
}