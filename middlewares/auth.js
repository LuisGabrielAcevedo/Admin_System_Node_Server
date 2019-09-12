const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddlewareSecondActionFunction = (req, res, next) => {
    authMiddleware(req, res, next, 'second_action');
}

const authMiddlewareFirstActionFunction = (req, res, next) => {
    authMiddleware(req, res, next, 'first_action');
}

const authMiddleware = async (req, res, next, action) => {
    // if (!req.headers.authorization) {
    //     return res.status(401).send({
    //         status: 'ERROR',
    //         code: 401,
    //         msg: 'auth_request_has_no_auth_header'
    //     });
    //     next();
    // } else {
    //     const token = req.headers.authorization.replace(/['"]+/g, '');
    //     jwt.verify(token, config.server.token.secret, (err, decoded) => {
    //         if (err) return res.status(401).send({
    //             status: 'ERROR',
    //             code: 401,
    //             msg: 'auth_token_has_expired'
    //         });
    //         req.tokenVerified = decoded.tokenUser;
    //         req.action = action;
    //         next();
    //     })
    // }
    next();
}

module.exports = {
    authMiddlewareFirstActionFunction,
    authMiddlewareSecondActionFunction
}