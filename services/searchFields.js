function seachFieldsData(route) {
    return searchBy[route]();
}

const searchBy = {
    users: () => ['email', 'lastName', 'firstName'],
    stores: () => ['name'],
    roles: () => ['name'],
    permissions: () => ['name', 'description', 'module'],
    customers: () => ['email', 'firstName', 'lastName', 'phone'],
    countries: () => ['name', 'nameInitials'],
    companies: () => ['name'],
    applications: () => ['name', 'code', 'description'],
    follows: () => []
}

module.exports = {
    seachFieldsData
}