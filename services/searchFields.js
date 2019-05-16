function seachFieldsData(route) {
    return searchBy[route]();
}

const searchBy = {
    users: () =>  ['email', 'lastName', 'firstName']
}

module.exports = {
    seachFieldsData
}