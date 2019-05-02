function seachFileds(collection) {
    let fields;
    switch (collection) {
        case 'User':
            fields = ['email', 'lastName', 'firstName'];
            break;
        default:
            fields = [];
            break;
    }
    return fields;
}

module.exports = {
    seachFileds
}