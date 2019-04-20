function body(collection, body, method) {
    let errors = {};
    let errorsStatus = false;
    return new Promise((resolve, reject) => {
        if (Object.entries(body).length === 0 && body.constructor === Object) {
            if (method === 'POST') {
                return reject({
                    status: 'WARNING',
                    code: 422,
                    msg: 'the_body_is_required'
                })
            }
        } else {
            if (method === 'POST') {
                for (const field in collection.schema.paths) {
                    if (collection.schema.paths[field].isRequired) {
                        if (!body.hasOwnProperty(field)) {
                            errors[field] = `the_field ${field} is_required`;
                            errorsStatus = true;
                        } else {
                            if (body[field] === 'null' || !body[field]) {
                                errorsStatus = true;
                                errors[field] = `the_field ${field} is_required`;
                            }
                        }
                    }
                }
            }

            for (const field in body) {
                if (!collection.schema.paths[field]) {
                    errors[field] = `the_field ${field} does_not_exist_in_the_entity ${collection.modelName.toLowerCase()}`;
                    errorsStatus = true;
                } else {
                    if (collection.schema.paths[field].instance === 'ObjectID') {
                        if (typeof body[field] !== 'string') {
                            errors[field] = `the_field ${field} should_be string`;
                            errorsStatus = true;
                        }
                    } else {
                        if (collection.schema.paths[field].instance.toLowerCase() !== typeof body[field]) {
                            errors[field] = `the_field ${field} should_be ${collection.schema.paths[field].instance.toLowerCase()}`;
                            errorsStatus = true;
                        }
                    }
                }
            }

            return errorsStatus ? reject({
                status: 'WARNING',
                code: 422,
                msg: errors
            }) : resolve();

        }
    })
}

module.exports = {
    body
}