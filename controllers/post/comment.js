const Comment = require('../../models/post/comment');
const Post = require('../../models/post/post');
const dataBase = require('../../services/dataBaseMethods');

// 0. Comment controller
function comment(req, res) {
    res.status(200).send({ msg: 'Comment controller works' });
}

// 1. Save comment
async function saveComment(req, res) {
    if (req.tokenVerified) {
        req.body.user = req.tokenVerified._id;
    }

    const payload = {
        requestData: req.body,
        collection: Comment
    }

    try {
        const resp = await dataBase.saveCollection(payload);
        await dataBase.incIdCollection({
            collection: Post,
            id: resp.data.post,
            inc: { totalComments: 1 }
        })
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    comment,
    saveComment
}