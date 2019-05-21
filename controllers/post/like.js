const Like = require('../../models/post/like');
const Post = require('../../models/post/post');
const dataBase = require('../../services/dataBaseMethods');

// 0. Like controller
function like(req, res) {
    res.status(200).send({ msg: 'Like controller works' });
}

// 1. Save like
async function saveLike(req, res) {
    if (req.tokenVerified) {
        req.body.user = req.tokenVerified._id;
    }

    const payload = {
        repeatedFieldsAnd: ['user', 'post'],
        requestData: req.body,
        collection: Like
    }

    try {
        const resp = await dataBase.saveCollection(payload);
        await dataBase.incIdCollection({
            collection: Post,
            id: resp.data.post,
            inc: { totalLikes: 1 }
        })
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    like,
    saveLike
}