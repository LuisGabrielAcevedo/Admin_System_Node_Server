// 0. Like controller
function like(req, res) {
    res.status(200).send({ msg: 'Like controller works' });
}

module.exports = {
    like
}