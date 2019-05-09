// Modelos
const Customer = require('../models/customer');
const CustomerInformation = require('../models/userInformation');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Metodos para manejar archivos
const fileMethods = require('../services/fileMethods');
// Libreria para trabajar con ficheros
const path = require('path');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');
// Metodos de validacion
const validation = require('../services/validation');

// 0. Funcion de prueba del controlador
function customer(req, res) {
    res.status(200).send({ msg: 'Controlador de clientes del sistema funcionando' })
}

// 1. Guardar un cliente
async function saveCustomer(req, res) {
    try {
        // await validation.body(Customer, req.body, 'POST');
        const customerInformation = await dataBase.saveCollection({
            requestData: req.body,
            collection: CustomerInformation
        });
        req.body.customerInformation = customerInformation.data._id;
        const resp = await dataBase.saveCollection({
            requestData: req.body,
            collection: Customer
        });
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener Clientes
async function getCustomers(req, res) {
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }

    const searchFields = ['email', 'firstName', 'lastName', 'phone'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};

    const payload = {
        collection: Customer,
        query: query,
        sort: req.query.sort ? req.query.sort : 'createdAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [
            {
                path: 'company',
                select: { createdAt: 0, updatedAt: 0, __v: 0 },
                populate: {
                    path: 'country',
                    select: { createdAt: 0, updatedAt: 0, __v: 0 }
                } 
            }, 
            {
                path: 'profileImage',
                select: { url: 1 }
            },
            {
                path: 'customerInformation',
                select: { createdAt: 0, updatedAt: 0, __v: 0  }
            }
        ]
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Buscar Clientes
async function findCustomers(req, res) {
    const payload = {
        id: req.params.id,
        collection: Customer,
        unselectFields: ['__v']
    }
    try {
        const resp = await dataBase.findCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 4. Actualizar informacion del Cliente
async function updateCustomer(req, res) {
    const payload = {
        id: req.params.id,
        collection: Customer,
        requestData: req.body,
        files: req.files,
        type: 'IMAGE_CUSTOMER',
        fileField: 'profileImage'
    }
    try {
        // await validation.body(Customer, req.body);
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 5. Borrar un Cliente
async function removeCustomer(req, res) {
    const payload = {
        id: req.params.id,
        collection: Customer,
        fileFields: ['profileImage']
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 6. Obtener la imagen del cliente
async function getImage(req, res) {
    const payload = {
        id: req.params.id,
        fileName: req.params.file,
        path: 'uploads/customer'
    }
    try {
        const resp = await fileMethods.getFile(payload);
        return res.sendFile(path.resolve(resp.url));
    } catch (err) {
        return res.status(err.code).send(err);
    }
}



// 7. Obtener clientes buscador
async function simpleSearch(req, res) {
    const searchFields = ['email', 'firstName', 'lastName', 'phone'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Customer,
        query: query,
        unselectFields: ['__v', 'password'],
        sort: req.query.sort ? req.query.sort : 'createdAt',
        populateFields: [
            {
                path: 'profileImage',
                select: { url: 1 }
            },
            {
                path: 'customerInformation',
                select: { createdAt: 0, updatedAt: 0, __v: 0  }
            }
        ]
    }
    try {
        const resp = await dataBase.simpleSearch(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


module.exports = {
    customer,
    saveCustomer,
    getCustomers,
    findCustomers,
    updateCustomer,
    removeCustomer,
    getImage,
    simpleSearch
}