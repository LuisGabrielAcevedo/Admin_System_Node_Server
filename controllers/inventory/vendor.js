const Vendor = require('../../models/inventory/vendor');
const dataBase = require('../../services/dataBaseMethods');

// 0. Vendor controller
function vendor(req, res) {
    res.status(200).send({ msg: 'Vendor controller works' })
}

// 1. Save vendor
async function saveVendor(req, res) {
    const payload = {
        requestData: req.body,
        collection: Vendor
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get vendors
async function getVendors(req, res) {
    const payload = {
        collection: Vendor,
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

// 3. Find vendor
async function findVendor(req, res) {
    const payload = {
        id: req.params.id,
        collection: Vendor,
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


// 4. Update vendor
async function updateVendor(req, res) {
    const payload = {
        id: req.params.id,
        collection: Vendor,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Delete vendor
async function deleteVendor(req, res) {
    const payload = {
        id: req.params.id,
        collection: Vendor
    };
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    vendor,
    saveVendor,
    updateVendor,
    deleteVendor,
    getVendors,
    findVendor
}