const Follow = require('../models/follow');
const dataBase = require('../services/dataBaseMethods');
const queryMethods = require('../services/query');

function follow(req, res) {
    res.status(200).send({ msg: 'Follow controller works' });
}

async function saveFollow(req, res) {
    if (req.tokenVerified) {
        // req.body.following = req.tokenVerified._id;
        req.body.company = req.tokenVerified.company._id ? req.tokenVerified.company._id : null;
        req.body.application = req.tokenVerified.application._id;
    }
    const payload = {
        requestData: req.body,
        collection: Follow
    }
    dataBase.saveCollection(payload)
    .then( resp => {
        return res.status(resp.code).send(resp);
    })
    .catch(err =>{
        return res.status(err.code).send(err);
    })
}

async function findFollows(req, res) {
    const searchFields = [];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    try {
        const resp = await dataBase.findCollection({
            collection: Follow,
            query: query,
            sort: req.query.sort ? req.query.sort : '-updatedAt',
            page: req.query.page ? Number(req.query.page) : 1,
            itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
            unselectFields: ['__v'],
            populateFields: [
            {
                path: 'followed',
                select: { _id: 1, email: 1, profileImage: 1, firstName: 1, lastName: 1},
                populate: {
                    path: 'profileImage',
                    select: { url: 1 }
                }
            },
            {
                path: 'following',
                select: { _id: 1, email: 1, profileImage: 1, firstName: 1, lastName: 1},
                populate: {
                    path: 'profileImage',
                    select: { url: 1 }
                }
            }
        ]
        });
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

async function deleteFollow(req, res) {
    try {
        const resp = await dataBase.deleteIdCollection({
            id: req.params.id,
            collection: Follow
        });
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    follow,
    saveFollow,
    deleteFollow,
    findFollows
}