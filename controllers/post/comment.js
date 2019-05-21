// 0. Comment controller
function comment(req, res) {
    res.status(200).send({ msg: 'Comment controller works' });
}

module.exports = {
    comment
}