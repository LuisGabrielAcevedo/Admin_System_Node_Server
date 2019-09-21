// Modelos
const Vendor = require('../../models/inventory/vendor');
// Metodos de base de datos
const dataBase = require('../../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../../services/query');
// Metodos de validacion
const validation = require('../../services/validation');


// 0. Funcion de prueba del controlador
function vendor(req, res) {
    res.status(200).send({ msg: 'Controlador de vendedor/proveedor funcionando' })
}

// 1. Guagar un vendedor de producto
async function saveVendor(req, res) {
    const payload = {
        requestData: req.body,
        collection: Vendor
    }
    try {
        await validation.body(Vendor, req.body, 'POST');
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener vendedores buscador
async function simpleSearch(req, res) {
    const searchFields = ['vendorName'];
    const query =
        req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Vendor,
        query: query,
        unselectFields: ['__v'],
        sort: req.query.sort ? req.query.sort : 'updatedAt'
    };
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}



// 3. Borrar vendedor
async function removeVendor(req, res) {
    const payload = {
        id: req.params.id,
        collection: Vendor
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 4. Actualizar vendedores
async function updateVendor(req, res) {
    const payload = {
        id: req.params.id,
        collection: Vendor,
        requestData: req.body
    }
    try {
        await validation.body(Vendor, req.body);
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 5.   Obtener vendedores
async function getVendors(req, res) {
    const searchFields = ['vendorName'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Vendor,
        query: query,
        sort: req.query.sort ? req.query.sort : 'updatedAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [{
                path: 'createdBy',
                select: { name: 1, _id: 1 },
            },

        ]
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    vendor,
    saveVendor,
    simpleSearch,
    updateVendor,
    removeVendor,
    getVendors
}