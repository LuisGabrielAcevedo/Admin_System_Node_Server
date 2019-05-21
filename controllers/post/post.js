const Post = require('../../models/post/post');
const dataBase = require('../../services/dataBaseMethods');
const queryMethods = require('../../services/query');

// 0. Post controller
function post(req, res) {
    res.status(200).send({ msg: 'Posts controller works' });
}

// 1. Save post 
async function savePost(req, res) {
    const payload = {
        requestData: Object.assign({
            user: req.tokenVerified._id,
            application: req.tokenVerified.application._id,
            company: req.tokenVerified.company ? req.tokenVerified.company._id : null
        }, req.body),
        collection: Post
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get posts 
async function getPosts(req, res) {
    const payload = {
        collection: Post,
        query: req.query.query,
        sort: req.query.sort,
        pagination: req.query.pagination,
        unselectFields: ['__v'],
        populateFields: req.query.populate
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Get post 
async function findPost(req, res) {
    const payload = {
        id: req.params.id,
        collection: Post,
        unselectFields: ['__v'],
        populateFields: req.query.populate
    }
    try {
        const resp = await dataBase.findByIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    post,
    savePost,
    getPosts,
    findPost
}