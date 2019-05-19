const User = require('../models/user');
const UserConfigurations = require('../models/userConfigurations');
const UserInformation = require('../models/information');
const dataBase = require('../services/dataBaseMethods');
const fileMethods = require('../services/fileMethods');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const config = require('../config');
const tokenExpired = config.server.token.timeExpired * 60;
const secret = config.server.token.secret;
const jwt = require('jsonwebtoken');
const userMethods = require('../services/user');


// 0. User controller
function user(req, res) {
    res.status(200).send({ msg: 'User controller works' });
}

// 1. Save user
async function saveUser(req, res) {
    const payload = {
        repeatedFieldsOr: ['email'],
        requestData: req.body,
        collection: User
    };
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get users
async function getUsers(req, res) {
    const payload = {
        collection: User,
        query: req.query.query,
        sort: req.query.sort,
        pagination: req.query.pagination,
        unselectFields: ['__v'],
        populateFields: req.query.populate
    };
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 3. Get users
async function findUser(req, res) {
    const payload = {
        id: req.params.id,
        collection: User,
        unselectFields: ['__v', 'password'],
        populateFields: req.query.populate
    }
    try {
        const resp = await dataBase.findByIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 4. Update user
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
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5. Delete user
async function removeUser(req, res) {
    const payload = {
        id: req.params.id,
        collection: User,
        fileFields: ['profileImage']
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 6. Get user images
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

// 8. Register user
async function userRegister(req, res) {
    try {
        // 1. Validate email repeated
        const user = await userMethods.validateEmail(req.body.email);
        // 2. Password
        req.body.password = await userMethods.encryptPassword(req.body.password);
        // 3. Save userConfigurations
        const userConfigurations = await dataBase.saveCollection({
            requestData: req.body,
            collection: UserConfigurations
        })
        // 4. Save userInformation
        const userInformation = await dataBase.saveCollection({
            requestData: req.body,
            collection: UserInformation
        });
        req.body.userConfigurations = userConfigurations.data._id;
        req.body.userInformation = userInformation.data._id;
        // 5. Save User
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
            [
                {
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
                    populate: [
                        {
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
                },
                {
                    path: 'profileImage',
                    select: { url: 1 }
                },
                {
                    path: 'userConfigurations',
                    select: { createdAt: 0, updatedAt: 0, deletedAt: 0, __v: 0 }
                },
                {
                    path: 'userInformation',
                    select: { createdAt: 0, updatedAt: 0, deletedAt: 0, __v: 0 }
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

                dataBaseResp.password = undefined;
                dataBaseResp.__v = undefined;

                // Create token
                const tokenUser = JSON.parse(JSON.stringify(dataBaseResp));;
                tokenUser.role = undefined;
                if (tokenUser.applicationRole === 'ADMIN') {
                    tokenUser.secret = config.server.token.adminPassword;
                    tokenUser.role = dataBaseResp.role._id;
                } else if (tokenUser.applicationRole === 'FREE_USER') {
                    tokenUser.secret = config.server.token.freeUserPassword;
                } else {
                    tokenUser.role = dataBaseResp.role._id;
                }

                const newToken = jwt.sign({ tokenUser }, secret, { expiresIn: tokenExpired });

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
    userRegister,
    userLogin
};