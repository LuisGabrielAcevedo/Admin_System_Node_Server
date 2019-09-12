const Role = require('../models/role');
const Permission = require('../models/permission');
const config = require('../config');

function roleMiddlewareFunction(req, res, next) {
    // if (req.tokenVerified.applicationRole === 'ADMIN') {
    //     if (req.tokenVerified.secret === config.server.token.adminPassword) {
    //         next();
    //     } else {
    //         return res.status(401).send({
    //             status: 'ERROR',
    //             code: 401,
    //             msg: 'invalid_user'
    //         });
    //     }
    //     next();
    // } else if (req.tokenVerified.applicationRole === 'FREE_USER') {
    //     if (req.tokenVerified.secret === config.server.token.freeUserPassword) {
    //         next();
    //     } else {
    //         return res.status(401).send({
    //             status: 'ERROR',
    //             code: 401,
    //             msg: 'invalid_user'
    //         });
    //     }
    // } else {
    //     getPermissionStatus(req)
    //         .then(resp => next())
    //         .catch(error => {
    //             return res.status(403).send({
    //                 status: 'ERROR',
    //                 code: 403,
    //                 msg: error.msg
    //             });
    //         });
    // }
    next();
}

function getPermissionStatus(req) {
    return new Promise((resolve, reject) => {
        const permissionPath = req.action === 'second_action' ? `${req.route.path.split('/')[1]}_${req.route.path.split('/')[2]}` : req.route.path.split('/')[1];
        const permisionName = `${req.route.stack[0].method}_${permissionPath}`;
        Promise.all([getPermissionData(req, permisionName), getRoleData(req.tokenVerified.role)])
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
            .catch(error => reject(error));

    })
}

function getPermissionData(req, permissionName) {
    return new Promise((resolve, reject) => {
        Permission.findOne({ name: permissionName }, (err, permission) => {
            if (err) return reject({ msg: 'auth_error_find_permission' });
            return !permission
                ? reject({ msg: 'auth_user_permission_does_not_exists' })
                : resolve({ permissionId: permission });
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
    roleMiddlewareFunction
}