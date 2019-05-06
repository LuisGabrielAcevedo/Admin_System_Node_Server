const mongoose = require('mongoose');
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
// Axios
const Axios = require('axios');
// Modelos
const Company = require('../models/company');
const User = require('../models/user');
const UserConfigurations = require('../models/userConfigurations');
const UserInformation = require('../models/userInformation');
const Image = require('../models/image');

// Metodos de usuario
const userMethods = require('../services/user');

function adminSystemServer(req, res) {
    res.status(200).send({ msg: 'Admin_System_Server works' });
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
    dataFile.forEach(company => {
        const payload = {
            requestData: company.company,
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
// 7. Generar usuarios 
async function randomUsers(req, res) {
    const applicationId = mongoose.Types.ObjectId("5cca3732a342520bbcd24563");
    saveUsersByApplication(applicationId);
    Company.find({}, (err, dataBaseResp) => {
        dataBaseResp.forEach(company => {
            getRandomUser().then(user => {
                const applicationId = mongoose.Types.ObjectId(company.application._id);
                const userToSave = {
                    email: user.email,
                    password: '123456',
                    firstName: user.name.first,
                    lastName: user.name.last,
                    company: company._id,
                    application: applicationId,
                    url: user.picture.large
                };
                saveUser(userToSave)
                    .then(resp => {
                        console.log('user saved');
                    })
                    .catch(e => {
                        console.log(e);
                    })
            });
        })
        res.status(200).send({
            status: 'OK',
            code: 200,
            msg: 'Usuarios creados'
        })
    })
}

function saveUsersByApplication(application) {
    const tryNumer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    tryNumer.forEach(() => {
        getRandomUser().then(user => {
            userToSave = {
                email: user.email,
                password: '123456',
                firstName: user.name.first,
                lastName: user.name.last,
                application: application,
                url: user.picture.large
            };
            saveUser(userToSave)
                .then(resp => {
                    console.log('user saved');
                })
                .catch(e => {
                    console.log(e);
                })
        })
    })
}

function getRandomUser() {
    return new Promise((resolve, reject) => {
        Axios.get('https://randomuser.me/api').then(resp => {
            resolve(resp.data.results[0]);
        })
    })
}

function saveUser(user) {
    return new Promise((resolve, reject) => {
        userMethods.encryptPassword(user.password)
            .then(resp1 => {
                user.password = resp1;
                dataBase.saveCollection({
                    requestData: user,
                    collection: UserConfigurations
                }).then(resp2 => {
                    dataBase.saveCollection({
                        requestData: user,
                        collection: UserInformation
                    }).then(resp3 => {
                        dataBase.saveCollection({
                            requestData: user,
                            collection: Image
                        }).then(resp4 => {
                            user.profileImage = resp4.data._id;
                            user.userConfigurations = resp2.data._id;
                            user.userInformation = resp3.data._id;
                            dataBase.saveCollection({
                                requestData: user,
                                collection: User
                            })
                                .then(resp5 => {
                                    resolve(resp5);
                                })
                                .catch(err5 => {
                                    reject(err5);
                                })
                        }).catch(err4 => {
                            reject(err4);
                        })
                    }).catch(err3 => {
                        reject(err3);
                    })
                }).catch(err2 => {
                    reject(err2);
                })
            })
            .catch(err1 => {
                reject(err1);
            })
    })
}


module.exports = {
    adminSystemServer,
    adminSystem,
    loadDataBaseData,
    apiProductTypes,
    coins,
    units,
    paymentMethods,
    randomUsers
}