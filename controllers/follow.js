const Follow = require('../models/follow');
const dataBase = require('../services/dataBaseMethods');

// 0. Follow constroller
function follow(req, res) {
    res.status(200).send({ msg: 'Follow controller works' });
}

// 1. Save follow
async function saveFollow(req, res) {
    if (req.tokenVerified) {
        req.body.following = req.tokenVerified._id;
        req.body.company = req.tokenVerified.company ? req.tokenVerified.company._id : null;
        req.body.application = req.tokenVerified.application._id;
    }
    const payload = {
        repeatedFieldsAnd: ['following', 'followed'],
        requestData: req.body,
        collection: Follow
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get follows
async function findFollows(req, res) {
    try {
        const resp = await dataBase.findCollection({
            collection: Follow,
            query: req.query.query,
            sort: req.query.sort,
            pagination: req.query.pagination,
            unselectFields: ['__v'],
            populateFields: [
                {
                    path: 'followed',
                    select: { _id: 1, email: 1, profileImage: 1, firstName: 1, lastName: 1 },
                    populate: {
                        path: 'profileImage',
                        select: { url: 1 }
                    }
                },
                {
                    path: 'following',
                    select: { _id: 1, email: 1, profileImage: 1, firstName: 1, lastName: 1 },
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

// 3. Delete follow
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