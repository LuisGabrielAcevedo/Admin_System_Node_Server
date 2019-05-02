const jwt = require('jsonwebtoken');
const config = require('../config');
const Role = require('../models/rol');
const Permission = require('../models/permission');

const authMiddlewareFunctionSecondAction = (req, res, next) => {
    authMiddleware(req, res, next, 'second_action');
}

const authMiddlewareFunction = (req, res, next) => {
    authMiddleware(req, res, next, 'first_action');
}

const authMiddleware = async (req, res, next, action) => {
    if (!req.headers.authorization) {
        return res.status(401).send({
            status: 'ERROR',
            code: 401,
            msg: 'auth_request_has_no_auth_header'
        });
        next();
    } else {
        const token = req.headers.authorization.replace(/['"]+/g, '');
        jwt.verify(token, config.server.token.secret, (err, decoded) => {
            if (err) return res.status(401).send({
                status: 'ERROR',
                code: 401,
                msg: 'auth_token_has_expired'
            });
            req.tokenVerified = decoded.tokenUser;
            if (decoded.tokenUser.secret) {
                if (decoded.tokenUser.secret === config.server.token.adminPassword) {
                    next();
                } else {
                    return res.status(401).send({
                        status: 'ERROR',
                        code: 401,
                        msg: 'invalid_admin'
                    });
                }
            } else {
                getPermissionStatus(req, decoded.tokenUser.role._id, action)
                    .then(resp => {
                        next();
                    })
                    .catch(error => {
                        return res.status(403).send({
                            status: 'ERROR',
                            code: 403,
                            msg: error.msg
                        });
                    });
            }
        })
    }
}

function getPermissionStatus(req, roleId, action) {
    return new Promise((resolve, reject) => {
        const permissionPath = action === 'second_action' ? `${req.route.path.split('/')[1]}_${req.route.path.split('/')[2]}` : req.route.path.split('/')[1];
        const permisionName = `${req.route.stack[0].method}_${permissionPath}`;
        Promise.all([getPermissionData(req,permisionName), getRoleData(roleId)])
            .then(resp => {
                const permisions = resp[1].permissionsRole;
                const permission = resp[0].permissionId;
                if (permisions.indexOf(permission._id) > -1) {
                    if (permission.pinCodeRequired) return reject({ msg: 'auth_user_permission_pincode_is_required' });
                    return resolve();
                } else {
                    return reject({ msg: 'auth_user_without_permission' });
                }
            })
            .catch(error => {
                return reject(error);
            })

    })
}

function getPermissionData(req, permissionName) {
    return new Promise((resolve, reject) => {
        Permission.findOne({ name: permissionName }, (err, permission) => {
            if (err) return reject({ msg: 'auth_error_find_permission' });
            if (!permission) {
                return reject({ msg: 'auth_user_permission_does_not_exists' });
            } else {
                return resolve({ permissionId: permission });
            }
        })
    })
}

function getRoleData(roleId) {
    return new Promise((resolve, reject) => {
        Role.findById({ _id: roleId }, (err, role) => {
            if (err) return reject({ msg: 'auth_error_find_role' });
            if (!role) return reject({ msg: 'auth_user_without_role' });
            return resolve({ permissionsRole: role.permissions });
        })
    })
}

module.exports = {
    authMiddlewareFunction,
    authMiddlewareFunctionSecondAction
}