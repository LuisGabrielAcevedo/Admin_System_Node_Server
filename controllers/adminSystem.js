// Constantes de la base de datos para recrear informacion
const dataFile = require('../dataBaseData/data');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// ApiProductTypes
const apiProductTypesData = require('../data/apiProductType');
// Coins
const coinsData = require('../data/coins');
// Units 
const unitsData = require('../data/unit');
// PaymentMethods
const paymentMethodsData = require('../data/paymentMethod');

// Modelos
const  Company = require('../models/company');

function adminSystemServer (req, res) {
    res.status(200).send({ msg: 'Admin_System_Server funcionando correctamente' });
}

// 1. Prueba del controlador
function adminSystem(req, res) {
    res.status(200).send({ msg: 'Controlador general del sistema funcionando' })
}

// 2. Obtener api product types
function apiProductTypes(req, res) {
    res.status(200).send({
        status: 'OK',
        code: 200,
        msg: 'Tipos de producto (API) encontrados',
        data: apiProductTypesData
    })
}

// 3. Cargar datos en la base de datos
function loadDataBaseData(req, res) {
    dataFile.data.forEach(company => {
        const payload = {
            requestData: company.data,
            collection: Company
        }
        dataBase.saveCollection(payload)
            .then(resp => {
                console.log('objeto creado');
            })
            .catch(err => {
                console.log('error guardado objeto');
            })
    })
}

// 4. Unidades de medida
function units(req, res) {
    res.status(200).send({
        status: 'OK',
        code: 200,
        msg: 'Lista de unidades (API) encontrada',
        data: unitsData
    })
}

// 5. Monedas
function coins(req, res) {
    res.status(200).send({
        status: 'OK',
        code: 200,
        msg: 'Lista de monedas (API) encontrada',
        data: coinsData
    })
}

// 6. Payment methods
function paymentMethods(req, res) {
    res.status(200).send({
        status: 'OK',
        code: 200,
        msg: 'Lista de metodos de pago (API) encontrada',
        data: paymentMethodsData
    })
}


module.exports = {
    adminSystemServer,
    adminSystem,
    loadDataBaseData,
    apiProductTypes,
    coins,
    units,
    paymentMethods
}