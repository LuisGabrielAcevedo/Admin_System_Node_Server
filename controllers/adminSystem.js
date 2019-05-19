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
const UserInformation = require('../models/information');
const Image = require('../models/image');
const Product = require('../models/product/product');
const Customer = require('../models/customer');
const CustomerInformation = require('../models/information');

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

// 8. Generar productos
function randomProducts(req, res) {
    const musicalInstruments = {
        products: [
            'guitarra electrica ibanez',
            'teclado korg',
            'teclado roland',
            'bateria yamaha',
            'guitarra yamaha',
            'bajo yamaha'
        ],
        application: '5cca2327062c7606d986e719',
        company: '5cca3fcb84ec060ef6e51de7'
    }
    const foodFast = {
        products: [
            'pizza napolitana',
            'hamburguesa',
            'coca cola',
        ],
        application: '5cca22d05084d906c1ffb022',
        company: '5ccd969611e62a5eb000b0dd'
    }
    Promise.all([
        saveProducts(musicalInstruments),
        saveProducts(foodFast)
    ])
        .then(resp => {
            res.status(200).send({
                status: 'OK',
                code: 200,
                msg: 'Productos creados'
            })
        })
        .catch(err => {
            console.log(err);
        })
}

function saveProducts(payload) {
    return new Promise((resolve, reject) => {
        let cont1 = 0
        payload.products.forEach(value => {
            mercadoLibreApi(value)
                .then(resp => {
                    let cont2 = 0
                    resp.forEach(product => {
                        let newProduct = {
                            name: product.title,
                            application: payload.application,
                            company: payload.company,
                            description: '',
                            url: product.thumbnail,
                            price: product.price,
                            unit: 'unity',
                            totalAvailable: product.sold_quantity
                        }
                        dataBase.saveCollection({
                            requestData: newProduct,
                            collection: Image
                        })
                            .then(resp1 => {
                                newProduct.profileImage = resp1.data._id;
                                dataBase.saveCollection({
                                    requestData: newProduct,
                                    collection: Product
                                })
                                    .then(resp2 => {
                                        cont2++;
                                        if (cont2 === resp.length) {
                                            cont1++;
                                        }
                                        if (cont1 === payload.products.length) {
                                            resolve(resp);
                                        }
                                    })
                                    .catch(err2 => {
                                        console.log(err2);
                                    })

                            })
                            .catch(err1 => {
                                console.log(err1);
                            })
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        })
    })
}

function mercadoLibreApi(value) {
    return new Promise((resolve, reject) => {
        Axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=:${value}&limit=2`).then(resp => {
            resolve(resp.data.results);
        })
    })
}

function randomCustomers(req, res) {
    saveCustomers({
        // application: '5cca2327062c7606d986e719',
        // company: '5cca3fcb84ec060ef6e51de7'
        application: '5cca22d05084d906c1ffb022',
        company: '5ccd969611e62a5eb000b0dd'
    })
    .then(resp => {
        res.status(200).send({
            status: 'OK',
            code: 200,
            msg: 'Clientes creados'
        })
    })
    .catch(err => {
        console.log(err);
    })
}

function saveCustomers(payload) {
    return new Promise((resolve, reject) => {
        const tryNumer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        let cont = 0;
        tryNumer.forEach(() => {
            getRandomUser().then(customer => {
                customerToSave = {
                    email: customer.email,
                    password: '123456',
                    firstName: customer.name.first,
                    lastName: customer.name.last,
                    application: payload.application,
                    company: payload.company,
                    url: customer.picture.large
                };
                saveCustomer(customerToSave)
                .then(resp => {
                    cont++;            
                    if (cont === tryNumer.length) {
                        resolve();
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            })
        })
    })
}

function saveCustomer(customer){
    return new Promise((resolve, reject) => {
        userMethods.encryptPassword(customer.password)
            .then(resp1 => {
                customer.password = resp1;
                    dataBase.saveCollection({
                        requestData: customer,
                        collection: CustomerInformation
                    }).then(resp3 => {
                        dataBase.saveCollection({
                            requestData: customer,
                            collection: Image
                        }).then(resp4 => {
                            customer.profileImage = resp4.data._id;
                            customer.customerInformation = resp3.data._id;
                            dataBase.saveCollection({
                                requestData: customer,
                                collection: Customer
                            })
                                .then(resp5 => {
                                    console.log('customer saved');
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
    randomUsers,
    randomProducts,
    randomCustomers
}