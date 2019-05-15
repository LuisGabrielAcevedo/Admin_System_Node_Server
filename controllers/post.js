const Post = require('../models/post');
const dataBase = require('../services/dataBaseMethods');
const queryMethods = require('../services/query');

// 0. Post controller
function post(req, res) {
    res.status(200).send({ msg: 'Posts controller works' });
}

module.exports = {
    post
}