// Modelos
const Admin = require('../models/admin');
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
// Libreria para registrar fecha y hora
const moment = require('moment');
// Metodos de validacion
const validation = require('../services/validation');

// 0. Funcion de prueba del controlador
function admin(req, res) {
    res.status(200).send({ msg: 'Controlador de administradores del sistema funcionando' })
}
// 1. Guagar un administrador
async function saveAdmin(req, res) {
    const payload = {
        repeatedFields: ['email', 'userName'],
        requestData: req.body,
        collection: Admin
    }
    try {
        await validation.body(Admin, req.body, 'POST');
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}
// 2. Buscar un administrador
async function findAdmin(req, res) {
    const payload = {
        id: req.params.id,
        collection: Admin,
        unselectFields: ['__v', 'password']
    }
    try {
        const resp = await dataBase.findCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}
// 3. Obtener admistradores
async function getAdmins(req, res) {
    const searchFields = ['email', 'lastName', 'firstName'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Admin,
        query: query,
        sort: req.query.sort ? req.query.sort : 'createdAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v', 'password']
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Actualizar un administrador
async function updateAdmin(req, res) {
    const payload = {
        id: req.params.id,
        collection: Admin,
        requestData: req.body,
        files: req.files,
        type: 'IMAGE_ADMIN',
        fileField: 'profileImage'
    }
    try {
        await validation.body(Admin, req.body);
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5. Borrar un administrador
async function removeAdmin(req, res) {
    const payload = {
        id: req.params.id,
        collection: Admin,
        fileFields: ['profileImage']
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 6. Obtener la imagen del administrador
async function getImage(req, res) {
    const payload = {
        id: req.params.id,
        fileName: req.params.file,
        path: 'uploads/admin'
    }
    try {
        const resp = await fileMethods.getFile(payload);
        return res.sendFile(path.resolve(resp.url));
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 7. Obtener administradores buscador
async function simpleSearch(req, res) {
    const searchFields = ['email', 'lastName', 'firstName'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Admin,
        query: query,
        unselectFields: ['__v', 'password'],
        sort: req.query.sort ? req.query.sort : 'createdAt'
    }
    try {
        const resp = await dataBase.simpleSearch(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 8. Resister admin
function adminRegister(req, res) {
    validation.body(Admin, req.body, 'POST')
        .then(validationResp => {
            let admin = new Admin();
            // 2. Asignar valores
            for (let field in req.body) {
                admin[field] = req.body[field];
            }
            admin['createdAt'] = moment().format('llll');
            // 3. Validar datos repetidos
            Admin.find({}).or([{ email: admin.email }, { userName: admin.userName }]).exec((err, dataBaseResp) => {
                if (err)
                    return res.status(500).send({
                        status: 'ERROR',
                        code: 500,
                        msg: 'data_base_error_repeated_fields'
                    });
                if (dataBaseResp && dataBaseResp.length >= 1)
                    return res.status(404).send({
                        status: 'WARNING',
                        code: 404,
                        msg: `the_user_already_exists`
                    });
                // 4. Encriptar contraseña 
                bcrypt.hash(admin.password, null, null, (err, hash) => {
                    admin.password = hash;
                    admin.save((err, dataBaseResp1) => {
                        if (err)
                            return res.status(500).send({
                                status: 'ERROR',
                                code: 500,
                                msg: `save_${Admin.modelName.toLowerCase()}_error`,
                            });
                        dataBaseResp1.__v = undefined;
                        return res.status(200).send({
                            status: 'OK',
                            code: 200,
                            msg: `save_${Admin.modelName.toLowerCase()}_success`,
                            data: dataBaseResp1
                        });
                    });
                })
            });
        })
        .catch(validationErrorResp => {
            return res.status(validationErrorResp.code).send(validationErrorResp);
        })

}

// 9. Login Admin
function adminLogin(req, res) {
    const adminfront = req.body;
    const email = adminfront.email.toLowerCase();
    const password = adminfront.password;
    Admin.findOne({ email: email })
        .exec((err, dataBaseResp) => {
            if (err) return res.status(500).send({
                status: 'ERROR',
                code: 500,
                msg: `find_id_${Admin.modelName.toLowerCase()}_error`
            })
            if (!dataBaseResp) return res.status(404).send({
                status: 'WARNING',
                code: 404,
                msg: `invalid_admin`
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
                const adminToToken = Object.assign({secret: config.server.token.adminPassword}, dataBaseResp._doc);
                const newToken = jwt.sign({ tokenUser: adminToToken }, secret, { expiresIn: tokenExpired });
                return res.status(200).send({
                    status: 'OK',
                    code: 200,
                    msg: `auth_admin_success`,
                    data: dataBaseResp,
                    token: newToken
                })
            })
        })
}



module.exports = {
    admin,
    saveAdmin,
    findAdmin,
    getAdmins,
    updateAdmin,
    removeAdmin,
    getImage,
    simpleSearch,
    adminLogin,
    adminRegister
}