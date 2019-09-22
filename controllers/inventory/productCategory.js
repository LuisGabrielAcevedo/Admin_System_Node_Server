const ProductCategories = require('../../models/inventory/productCategory');
const dataBase = require('../../services/dataBaseMethods');

// 0. Product category controller
function productCategory(req, res) {
    res.status(200).send({ msg: 'Product category controller works' })
}

// 1. Save product category
async function saveProductCategory(req, res) {
    const payload = {
        requestData: req.body,
        collection: ProductCategories
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get product categories
async function getProductCategories(req, res) {
    const payload = {
        collection: ProductCategories,
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

// 3. Find product category
async function findProductCategory(req, res) {
    const payload = {
        id: req.params.id,
        collection: ProductCategories,
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


// 4. Update product category
async function updateProductCategory(req, res) {
    const payload = {
        id: req.params.id,
        collection: ProductCategories,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Delete product category
async function deleteProductCategory(req, res) {
    const payload = {
        id: req.params.id,
        collection: ProductCategories
    };
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    productCategory,
    saveProductCategory,
    updateProductCategory,
    deleteProductCategory,
    getProductCategories,
    findProductCategory
}