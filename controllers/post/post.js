const Post = require('../../models/post/post');
const Like = require('../../models/post/like');
const Comment = require('../../models/post/comment');
const dataBase = require('../../services/dataBaseMethods');

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
        populateFields: [
            ...req.query.populate,
            {
                path: 'user',
                select: { firstName: 1, lastName: 1, updatedAt: 1 },
                populate: {
                    path: 'profileImage',
                    select: { url: 1 }
                }
            }
        ]
    }
    try {
        const resp = await dataBase.findCollection(payload);
        const populateLikes = req.query.populate.find(populateItem => populateItem.path === 'likes');
        const populateComments = req.query.populate.find(populateItem => populateItem.path === 'comments');
        let posts = [];
        let cont = 0;
        resp.data.forEach(async (post) => {
            let postFormated = JSON.parse(JSON.stringify(post));
            if (populateLikes && postFormated.totalLikes > 0) {
                let likes = await likesPerPost(postFormated._id);
                postFormated.likes = likes.data.length ? {
                    totalItems: likes.totalItems,
                    currentPage: likes.currentPage,
                    itemsPerPage: likes.itemsPerPage,
                    data: likes.data
                } : [];
            }
            if (populateComments && postFormated.totalComments > 0) {
                let commets = await commentsPerPost(postFormated._id);
                postFormated.commets = commets.data.length ? {
                    totalItems: commets.totalItems,
                    currentPage: commets.currentPage,
                    itemsPerPage: commets.itemsPerPage,
                    data: commets.data
                } : [];
            }
            cont++;
            posts.push(postFormated);
            if (cont === resp.data.length) {
                resp.data = posts;
                return res.status(resp.code).send(resp);
            }
        });
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
        const populateLikes = req.query.populate.find(populateItem => populateItem.path === 'likes');
        const populateComments = req.query.populate.find(populateItem => populateItem.path === 'comments');
        let postFormated = JSON.parse(JSON.stringify(resp.data));
        if (populateLikes && postFormated.totalLikes > 0) {
            let likes = await likesPerPost(postFormated._id);
            postFormated.likes = likes.data.length ? {
                totalItems: likes.totalItems,
                currentPage: likes.currentPage,
                itemsPerPage: likes.itemsPerPage,
                data: likes.data
            } : [];
        }
        if (populateComments && postFormated.totalComments > 0) {
            let commets = await commentsPerPost(postFormated._id);
            postFormated.commets = commets.data.length ? {
                totalItems: commets.totalItems,
                currentPage: commets.currentPage,
                itemsPerPage: commets.itemsPerPage,
                data: commets.data
            } : [];
        }
        resp.data = postFormated;
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

async function likesPerPost(postId) {
    try {
        return await dataBase.findCollection({
            collection: Like,
            query: { post: postId },
            sort: "-updatedAt",
            pagination: { page: 1, itemsPerPage: 10 },
            unselectFields: ['__v', 'createdAt', 'deletedAt'],
            populateFields: [
                {
                    path: 'user',
                    select: { firstName: 1, lastName: 1, updatedAt: 1 },
                    populate: {
                        path: 'profileImage',
                        select: { url: 1 }
                    }
                }
            ]
        });
    } catch (e) {
        return e;
    }
}

async function commentsPerPost(postId) {
    try {
        return await dataBase.findCollection({
            collection: Comment,
            query: { post: postId },
            sort: "-updatedAt",
            pagination: { page: 1, itemsPerPage: 10 },
            unselectFields: ['__v', 'createdAt', 'deletedAt'],
            populateFields: [
                {
                    path: 'user',
                    select: { firstName: 1, lastName: 1, updatedAt: 1 },
                    populate: {
                        path: 'profileImage',
                        select: { url: 1 }
                    }
                }
            ]
        });
    } catch (e) {
        return e;
    }
}


module.exports = {
    post,
    savePost,
    getPosts,
    findPost
}