function validationsMiddlewareFunction(req, res, next) {
    let errors = {};
    let errorsStatus = false;
    const method = req.route.stack[0].method;
    const route = req.route.path.split('/')[1];
    const body = req.body;
    if (Object.entries(body).length === 0 && body.constructor === Object) {
        return res.status(422).send({
            status: 'WARNING',
            code: 422,
            msg: `The body is empty, please send data to ${method === 'post' ? 'save' : 'update'}`
        });
    } else {
        const collection = models[route]();
        for (const field in collection.schema.paths) {
            if (collection.schema.paths[field].isRequired) {
                if (!body[field]) {
                    errors[field] = `is_required`;
                    errorsStatus = true;
                }
            }
        }

        // const Joi = require('joi');
        // const vaidations = validations[route]();
        // Joi.validate(req.body, vaidations, function (err, value) {
        //     if (err && err.details) {
        //         for (const error in err.details) {
        //             if (err.details[error]) {
        //                 errors[err.details[error].path[0]] = `The field ${err.details[error].message.replace(/["]+/g, '')}`;
        //                 errorsStatus = true;
        //             }
        //         }
        //     }
        // });

        // errors
        //     ? res.status(422).send({
        //         status: 'WARNING',
        //         code: 422,
        //         msg: errors
        //     }) : next();

        if (errorsStatus) {
            res.status(422).send({
                status: 'WARNING',
                code: 422,
                msg: errors
            })
        } else {
            if (route === 'users' && method === 'post') {
                if (req.body.applicationRole === 'USER') {
                    if (!req.body.application) {
                        return res.status(422).send({
                            status: 'WARNING',
                            code: 422,
                            msg: {
                                application: 'is_required'
                            }
                        })
                    }
                    if (!req.body.company) {
                         return res.status(422).send({
                            status: 'WARNING',
                            code: 422,
                            msg: {
                                company: 'is_required'
                            }
                        })
                    }
                    next();
                } else if (req.body.applicationRole === 'FREE_USER') {
                    if (!req.body.application) {
                        return res.status(422).send({
                            status: 'WARNING',
                            code: 422,
                            msg: {
                                application: 'is_required'
                            }
                        })
                    }
                    next();
                } else if (req.body.applicationRole === 'ADMIN') {
                    next();
                } else {
                    return res.status(422).send({
                        status: 'WARNING',
                        code: 422,
                        msg: 'invalid_application_role'
                    })
                }
            } else if (route === 'follows' && method === 'post') {
                if (!['5ce01e90faf3940017b6b0b2','5cca3732a342520bbcd24563'].includes(String(req.tokenVerified.application._id))) {
                    return res.status(422).send({
                        status: 'WARNING',
                        code: 422,
                        msg: 'User without permission to follow'
                    })
                } 
                next();
            } else {
                next();
            }
        }
    }
}

module.exports = {
    validationsMiddlewareFunction
}

const companies = require('../models/company');
const users = require('../models/user');
const userConfigurations = require('../models/userConfigurations');
const information = require('../models/information');
const products = require('../models/product/product');
const customers = require('../models/customer');
const roles = require('../models/role');
const permissions = require('../models/permission');
const stores = require('../models/store');
const applications = require('../models/application');
const countries = require('../models/country');
const follows = require('../models/follow');
const posts = require('../models/post/post');
const licenses = require('../models/license');
const likes = require('../models/post/like');
const comments = require('../models/post/comment');

const models = {
    companies: () => companies,
    users: () => users,
    stores: () => stores,
    permissions: () => permissions,
    roles: () => roles,
    customers: () => customers,
    products: () => products,
    information: () => information,
    userConfigurations: () => userConfigurations,
    applications: () => applications,
    countries: () => countries,
    follows: () => follows,
    posts: () => posts,
    likes: () => likes,
    licenses: () => licenses,
    comments: ()=> comments
}