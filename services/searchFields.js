function seachFileds(collection) {
    return searchBy[collection]();
}

const searchBy = {
    User: () =>  ['email', 'lastName', 'firstName']
}

module.exports = {
    seachFileds
}