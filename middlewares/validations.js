function validationsMiddlewareFunction(req, res, next) {
    const method = req.route.stack[0].method;
    const body = req.body;
    if (Object.entries(body).length === 0 && body.constructor === Object) {
        return res.status(401).send({
            status: 'WARNING',
            code: 422,
            msg: `The body is empty, please send data to ${method === 'post' ? 'save' : 'update'}`
        });
    }
    next();
}

module.exports = {
    validationsMiddlewareFunction
}
