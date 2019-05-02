// Models
const User = require('../models/user');
// Libreria para encriptar 
const bcrypt = require('bcrypt-nodejs');

function encryptPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, null, null, (err, hash) => {
            if (err) return reject({
                status: 'WARNING',
                code: 422,
                msg: `error_encrypting_password`
            })
            resolve(hash);
        });
    });
}

function decryptPassword(password, passwordUser) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordUser, (err, check) => {
            if (err) return reject({
                status: 'WARNING',
                code: 422,
                msg: `invalid_password`
            })
            resolve(check);
        });
    });
}

function validateEmail(email) {
    return new Promise((resolve, reject) => {
        User.find({}).or([{ email: email }]).exec((err, dataBaseResp) => {
            if (err)
                return reject({
                    status: 'ERROR',
                    code: 500,
                    msg: 'data_base_error_repeated_fields'
                });
            if (dataBaseResp && dataBaseResp.length >= 1)
                return reject({
                    status: 'WARNING',
                    code: 422,
                    msg: `the_user_already_exists`
                });
            resolve(dataBaseResp);
        })
    });
}

module.exports = {
    encryptPassword,
    decryptPassword,
    validateEmail
}