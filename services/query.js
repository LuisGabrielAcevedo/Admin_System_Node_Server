const searchFieldsMethods = require('./searchFields');

function query(search, filters, searchRoute) {
    if (searchRoute.includes('-')) {
        searchRoute = searchRoute.split('-').join('');
    }
    const searchFields = searchFieldsMethods.seachFieldsData(searchRoute);
    let orParams = [];
    const andParams = filters ? filters : {};
    let query;
    if (search) {
        const searchExpresion = new RegExp(search, 'i');
        searchFields.forEach((element) => {
            let obj = new Object();
            obj[element] = searchExpresion;
            orParams.push(obj);
        });
        query = {
            $and: [
                {
                    $or: orParams
                },
                andParams
            ]
        };
    } else {
        query = {
            $and: [
                andParams
            ]
        };
    }
    return query;
}

module.exports = {
    query
}