const Product = require('../../models/inventory/product');
const dataBase = require('../../services/dataBaseMethods');

// 0. Product controller
function product(req, res) {
    res.status(200).send({ msg: 'Product controller works' })
}

// 1. Save product 
async function saveProduct(req, res) {
    const payload = {
        requestData: req.body,
        collection: Product
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get products
async function getProducts(req, res) {
    const payload = {
        collection: Product,
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

// 3. Find product 
async function findProduct(req, res) {
    const payload = {
        id: req.params.id,
        collection: Product,
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


// 4. Update product 
async function updateProduct(req, res) {
    const payload = {
        id: req.params.id,
        collection: Product,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Delete product 
async function deleteProduct(req, res) {
    const payload = {
        id: req.params.id,
        collection: Product
    };
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    product,
    saveProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    findProduct
}