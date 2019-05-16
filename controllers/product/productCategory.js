// Modelos
const ProductCategory = require('../../models/product/productCategory');
// Metodos de base de datos
const dataBase = require('../../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../../services/query');
// Metodos de validacion
const validation = require('../../services/validation');

// 0. Funcion de prueba del controlador
function productCategory(req, res) {
    res.status(200).send({ msg: 'Controlador de categorias de productos funcionando' })
}
// 1. Guagar una categoria
async function saveProductCategory(req, res) {
    const payload = {
        requestData: req.body,
        collection: ProductCategory
    }
    try {
        await validation.body(ProductCategory, req.body, 'POST');
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener categorias buscador
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
        collection: ProductCategory,
        query: query,
        unselectFields: ['__v'],
        sort: req.query.sort ? req.query.sort : '-updatedAt'
    };
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Borrar categorias
async function removeProductCategory(req, res) {
    const payload = {
        id: req.params.id,
        collection: ProductCategory
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Actualizar categorias
async function updateProductCategory(req, res) {
    const payload = {
        id: req.params.id,
        collection: ProductCategory,
        requestData: req.body
    }
    try {
        await validation.body(ProductCategory, req.body);
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5.   Obtener categorias
async function getProductCategories(req, res) {
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: ProductCategory,
        query: query,
        sort: req.query.sort ? req.query.sort : '-updatedAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [{
            path: 'company',
            select: { name: 1, _id: 1 }
        }]
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


module.exports = {
    saveProductCategory,
    productCategory,
    simpleSearch,
    removeProductCategory,
    updateProductCategory,
    getProductCategories

}