// Modelos
const Product = require('../../models/inventory/product');
const dataBase = require('../../services/dataBaseMethods');
const fileMethods = require('../../services/fileMethods');
const path = require('path');

// 0. Funcion de prueba del controlador
function product(req, res) {
    res.status(200).send({ msg: 'Controlador productos funcionando' })
}
// 1. Guagar un producto
async function saveProduct(req, res) {
    const payload = {
        requiredFields: ['name', 'company', 'applicationCode', 'price', 'unit'],
        requestData: req.body,
        collection: Product,
        successMessage: 'Producto guardado con exito',
        errorMessage: 'Error guardando producto'
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Buscar productos
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

// 3. Actualizar un producto
async function updateProduct(req, res) {
    const payload = {
        id: req.params.id,
        collection: Product,
        requestData: req.body,
        files: req.files,
        type: 'IMAGE_PRODUCT',
        fileField: 'profileImage'
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Obtener la imagen del producto
async function getImage(req, res) {
    const payload = {
        id: req.params.id,
        fileName: req.params.file,
        path: 'uploads/product'
    }
    try {
        const resp = await fileMethods.getFile(payload);
        return res.sendFile(path.resolve(resp.url));
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5. Delete product
async function removeProduct(req, res) {
    const payload = {
        id: req.params.id,
        collection: Product
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

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


module.exports = {
    saveProduct,
    product,
    getProducts,
    updateProduct,
    getImage,
    removeProduct,
    findProduct
}