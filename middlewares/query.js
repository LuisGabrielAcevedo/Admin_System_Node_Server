function queryMiddlewareFunction(req, res, next) {
    req.query.sort = req.query.sort ? req.query.sort : '-updatedAt';
    req.query.page = req.query.page ? Number(req.query.page) : 1;
    req.query.itemsPerPage = req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10
    next();
}

module.exports = {
    queryMiddlewareFunction
}