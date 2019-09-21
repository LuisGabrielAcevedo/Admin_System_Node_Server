// Modelos
const ProductType = require('../../models/inventory/productType');
// Metodos de base de datos
const dataBase = require('../../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../../services/query');
// Metodos de validacion
const validation = require('../../services/validation');

// 0. Funcion de prueba del controlador
function productType(req, res) {
    res.status(200).send({ msg: 'Controlador de tipos de productos funcionando' })
}

// 1. Guagar un tipo de producto
async function saveProductType(req, res) {
    const payload = {
        requestData: req.body,
        collection: ProductType
    }
    try {
        await validation.body(ProductType, req.body, 'POST');
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener tipos de producto buscador
async function simpleSearch(req, res) {
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }
    const searchFields = ['name'];
    const query =
        req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: ProductType,
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

// 3. Borrar producto
async function removeProductType(req, res) {
    const payload = {
        id: req.params.id,
        collection: ProductType
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 4. Actualizar producto
async function updateProductType(req, res) {
    const payload = {
        id: req.params.id,
        collection: ProductType,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5.   Obtener marcas
async function getProductTypes(req, res) {
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: ProductType,
        query: query,
        sort: req.query.sort ? req.query.sort : 'updatedAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [{
                path: 'company',
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
    saveProductType,
    productType,
    simpleSearch,
    removeProductType,
    updateProductType,
    getProductTypes
}