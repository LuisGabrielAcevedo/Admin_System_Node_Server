// Models
const User = require('../models/user');
const UserConfigurations = require('../models/userConfigurations');
const UserInformation = require('../models/userInformation');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Metodos para manejar archivos
const fileMethods = require('../services/fileMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');
// Libreria para trabajar con ficheros
const path = require('path');
// Libreria para encriptar 
const bcrypt = require('bcrypt-nodejs');
// Configuraciones generales
const config = require('../config');
const tokenExpired = config.server.token.timeExpired * 60;
const secret = config.server.token.secret;
// Libreria para crear tokens
const jwt = require('jsonwebtoken');
// Metodos de validacion
const validation = require('../services/validation');
// Metodos de usuario
const userMethods = require('../services/user');


// 0. Funcion de prueba del controlador
function user(req, res) {
    res.status(200).send({ msg: 'Controlador de usuarios funcionando' });
}
// 1. Guardar usuario
async function saveUser(req, res) {
    const payload = {
        repeatedFields: ['email'],
        requestData: req.body,
        collection: User
    };
    try {
        await validation.body(User, req.body, 'POST');
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener Usuarios
async function getUsers(req, res) {
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }

    const searchFields = ['email', 'lastName', 'firstName'];

    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};

    const payload = {
        collection: User,
        query: query,
        sort: req.query.sort ? req.query.sort : '-updatedAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [{
            path: 'company',
            select: { createdAt: 0, updatedAt: 0, __v: 0 },
            populate: {
                path: 'country',
                select: { createdAt: 0, updatedAt: 0, __v: 0 }
            }
        },
        {
            path: 'role',
            select: { createdAt: 0, updatedAt: 0, __v: 0 },
            populate: [{
                path: 'permissions',
                select: { createdAt: 0, updatedAt: 0, __v: 0, applications: 0, description: 0 }
            },
            {
                path: 'stores',
                select: { createdAt: 0, updatedAt: 0, __v: 0 }
            }
            ]
        },
        {
            path: 'application',
            select: { createdAt: 0, updatedAt: 0, __v: 0, description: 0 }
        }
        ]
    };
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 3. Buscar un usuario
async function findUser(req, res) {
    const payload = {
        id: req.params.id,
        collection: User,
        unselectFields: ['__v', 'password'],
        populateFields: [
            {
                path: 'company',
                select: { name: 1, _id: 1 }
            },
            {
                path: 'role',
                select: { name: 1, _id: 1 }
            }
        ]
    }
    try {
        const resp = await dataBase.findCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 4. Actualizar un usuario
async function updateUser(req, res) {
    const payload = {
        id: req.params.id,
        collection: User,
        requestData: req.body,
        files: req.files,
        type: 'IMAGE_USER',
        fileField: 'profileImage'
    }
    try {
        await validation.body(User, req.body);
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5. Borrar un usuario
async function removeUser(req, res) {
    const payload = {
        id: req.params.id,
        collection: User,
        fileFields: ['profileImage']
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 6. Obtener la imagen del user
async function getImage(req, res) {
    const payload = {
        id: req.params.id,
        fileName: req.params.file,
        path: 'uploads/user'
    }
    try {
        const resp = await fileMethods.getFile(payload);
        return res.sendFile(path.resolve(resp.url));
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 7. Obtener users buscador
async function simpleSearch(req, res) {
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }
    const searchFields = ['email', 'lastName', 'firstName'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};

    const payload = {
        collection: User,
        query: query,
        unselectFields: [
            '__v', 'password', 'createdAt', 'updatedAt', 'deletedAt',
            'documentType', 'documentNumber', 'language', 'application'
        ],
        sort: req.query.sort ? req.query.sort : '-updatedAt',
        populateFields: [
            {
                path: 'company',
                select: { name: 1, _id: 1 }
            },
            {
                path: 'role',
                select: { name: 1, _id: 1 }
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

// 8. Register user
async function userRegister(req, res) {
    try {
        // 1. Validate
        await validation.body(User, req.body, 'POST');
        // 2. Validate email repeated
        const user = await userMethods.validateEmail(req.body.email);
        // 3. Password
        req.body.password = await userMethods.encryptPassword(req.body.password);
        // 4. Save userConfigurations
        const userConfigurations = await dataBase.saveCollection({
            requestData: req.body,
            collection: UserConfigurations
        })
        // 5. Save userInformation
        const userInformation = await dataBase.saveCollection({
            requestData: req.body,
            collection: UserInformation
        });
        req.body.userConfigurations = userConfigurations.data._id;
        req.body.userInformation = userInformation.data._id;
        // 6. Save User
        const resp = await dataBase.saveCollection({
            requestData: req.body,
            collection: User
        });
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 9. Login user
function userLogin(req, res) {
    const userfront = req.body;
    const email = userfront.email.toLowerCase();
    const password = userfront.password;
    User.findOne({ email: email })
        .populate(
            [{
                path: 'company',
                select: { _id: 1, name: 1 },
                populate: {
                    path: 'country',
                    select: { _id: 1, name: 1 }
                }
            },
            {
                path: 'role',
                select: { _id: 1, name: 1 },
                populate: [{
                    path: 'permissions',
                    select: { _id: 1, name: 1 }
                },
                {
                    path: 'stores',
                    select: { _id: 1, name: 1 }
                }
                ]
            },
            {
                path: 'application',
                select: { _id: 1, name: 1 }
            }
            ]
        )
        .exec((err, dataBaseResp) => {
            if (err) return res.status(500).send({
                status: 'ERROR',
                code: 500,
                msg: `find_id_${User.modelName.toLowerCase()}_error`
            })
            if (!dataBaseResp) return res.status(404).send({
                status: 'WARNING',
                code: 422,
                msg: `invalid_user`
            })
            bcrypt.compare(password, dataBaseResp.password, (err, check) => {
                if (!check) return res.status(404).send({
                    status: 'WARNING',
                    code: 422,
                    msg: `invalid_password`
                })
                // Crear token
                dataBaseResp.password = undefined;
                dataBaseResp.__v = undefined;
                const newToken = jwt.sign({ tokenUser: dataBaseResp }, secret, { expiresIn: tokenExpired });
                return res.status(200).send({
                    status: 'OK',
                    code: 200,
                    msg: `auth_user_success`,
                    data: dataBaseResp,
                    token: newToken
                })
            })

        })
}





module.exports = {
    user,
    saveUser,
    getUsers,
    findUser,
    updateUser,
    removeUser,
    getImage,
    simpleSearch,
    userRegister,
    userLogin
};