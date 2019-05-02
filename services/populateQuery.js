function populateQuery(populate) {
    let populateQuery = [];
    const populateFirstSplit = populate.split(',');
    for (const field in populateFirstSplit) {
        if (populateFirstSplit[field]) {
            const populateSecondSplit = populateFirstSplit[field].split('.');
            let populateObject = new Object();
            if (populateSecondSplit.length === 1) {
                populateObject.path = populateSecondSplit[0];
                populateObject.select = {__v: 0}
                populateQuery.push(populateObject);
            } else if (populateSecondSplit.length > 1) {
                populateObject.path = populateSecondSplit[0];
                populateObject.select = {__v: 0}
                populateObject.populate = [
                    {
                        path: populateSecondSplit[1],
                        select: {__v: 0}
                    }
                ]
                populateQuery.push(populateObject);
            } 
        }
    }
    return populateQuery;
}

module.exports = {
    populateQuery
}