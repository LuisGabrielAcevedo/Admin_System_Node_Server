// Modelos
const Brand = require('../../models/inventory/brand');
// Metodos de base de datos
const dataBase = require('../../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../../services/query');
// Metodos de validacion
const validation = require('../../services/validation');

// 0. Funcion de prueba del controlador
function brand(req, res) {
    res.status(200).send({ msg: 'Controlador de categorias de productos funcionando' })
}
// 1. Guagar una marca de producto
async function saveBrand(req, res) {
    const payload = {
        requiredFields: ['name', 'company'],
        requestData: req.body,
        collection: Brand
    }
    try {
        await validation.body(Brand, req.body, 'POST');
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener marcas buscador
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
        collection: Brand,
        query: query,
        unselectFields: ['__v'],
        sort: req.query.sort ? req.query.sort : 'createdAt'
    };
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}



// 3. Borrar marcas
async function removeBrand(req, res) {
    const payload = {
        id: req.params.id,
        collection: Brand
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 4. Actualizar marcas
async function updateBrand(req, res) {
    const payload = {
        id: req.params.id,
        collection: Brand,
        requestData: req.body
    }
    try {
        await validation.body(Brand, req.body);
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5.   Obtener marcas
async function getBrands(req, res) {
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Brand,
        query: query,
        sort: req.query.sort ? req.query.sort : 'createdAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [{
            path: 'company',
            select: { name: 1, _id: 1 }
        }]
        // filters: [
        //     {
        //         field: 'company',
        //         collection: Company
        //     },
        //     {
        //         field: 'category',
        //         collection: ProductCategory
        //     }
        // ]
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


module.exports = {
    saveBrand,
    brand,
    simpleSearch,
    removeBrand,
    updateBrand,
    getBrands
}