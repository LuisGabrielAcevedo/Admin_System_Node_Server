const ProductTypes = require('../../models/inventory/productType');
const dataBase = require('../../services/dataBaseMethods');

// 0. Product type controller
function productType(req, res) {
    res.status(200).send({ msg: 'Product type controller works' })
}

// 1. Save product type
async function saveProductType(req, res) {
    const payload = {
        requestData: req.body,
        collection: ProductTypes
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get product types
async function getProductTypes(req, res) {
    const payload = {
        collection: ProductTypes,
        query: req.query.query,
        sort: req.query.sort,
        pagination: req.query.pagination,
        unselectFields: ['__v'],
        populateFields: req.query.populate
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Find product type
async function findProductType(req, res) {
    const payload = {
        id: req.params.id,
        collection: ProductTypes,
        unselectFields: ['__v'],
        populateFields: req.query.populate
    }
    try {
        const resp = await dataBase.findByIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 4. Update product type
async function updateProductType(req, res) {
    const payload = {
        id: req.params.id,
        collection: ProductTypes,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Delete product type
async function deleteProductType(req, res) {
    const payload = {
        id: req.params.id,
        collection: ProductTypes
    };
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    productType,
    saveProductType,
    updateProductType,
    deleteProductType,
    getProductTypes,
    findProductType
}