const Country = require('../models/country');
const dataBase = require('../services/dataBaseMethods');

// 0. Country controller
function country(req, res) {
    res.status(200).send({ msg: 'Country controller works' });
}

// 1. Save country
async function saveCountry(req, res) {
    const payload = {
        repeatedFieldsOr: ['name', 'nameInitials'],
        requestData: req.body,
        collection: Country
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get countries
async function getCountries(req, res) {
    const payload = {
        collection: Country,
        query: req.query.query,
        sort: req.query.sort,
        pagination: req.query.pagination,
        unselectFields: ['__v']
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Get country
async function findCountries(req, res) {
    const payload = {
        id: req.params.id,
        collection: Country,
        unselectFields: ['__v']
    }
    try {
        const resp = await dataBase.findByIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Update country
async function updateCountry(req, res) {
    const payload = {
        id: req.params.id,
        collection: Country,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5. Borrar un Pais
async function deleteCountry(req, res) {
    const payload = {
        id: req.params.id,
        collection: Country
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    country,
    saveCountry,
    getCountries,
    findCountries,
    updateCountry,
    deleteCountry
}