const queryMethods = require('../services/query');
const populateMethods = require('../services/populateQuery');

function queryMiddlewareFunction(req, res, next) {

    // Pagination
    if (req.query.page || req.query.itemsPerPage) {
        req.query.pagination = {
            page:req.query.page ? Number(req.query.page) : 1,
            itemsPerPage:req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10
        }
    } else {
        req.query.pagination = null;
    }

    // Sort
    req.query.sort = req.query.sort ? req.query.sort : '-updatedAt';

    // Populate
    req.query.populate = req.query.populate ? populateMethods.populateQuery(req.query.populate) : [];;

    // Query
    req.query.query = req.query.search || req.query.filters ?
    queryMethods.query(req.query.search, req.query.filters, req.route.path.split('/')[1]) : {};
    next();
}

module.exports = {
    queryMiddlewareFunction
}