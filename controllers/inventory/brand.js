const Brand = require('../../models/inventory/brand');
const dataBase = require('../../services/dataBaseMethods');

// 0. Brand controller
function brand(req, res) {
    res.status(200).send({ msg: 'Brand controller works' })
}

// 1. Save brand
async function saveBrand(req, res) {
    const payload = {
        requestData: req.body,
        collection: Brand
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get brands
async function getBrands(req, res) {
    const payload = {
        collection: Brand,
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

// 3. Find brand
async function findBrand(req, res) {
    const payload = {
        id: req.params.id,
        collection: Brand,
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


// 4. Update brand
async function updateBrand(req, res) {
    const payload = {
        id: req.params.id,
        collection: Brand,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Delete brand
async function deleteBrand(req, res) {
    const payload = {
        id: req.params.id,
        collection: Brand
    };
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    brand,
    saveBrand,
    updateBrand,
    deleteBrand,
    getBrands,
    findBrand
}