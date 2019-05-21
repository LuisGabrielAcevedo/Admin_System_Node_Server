const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = Schema({
	user: { type: Schema.ObjectId, ref: 'User', default: null },
	post: { type: Schema.ObjectId, ref: 'Post', default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null }
});

module.exports = mongoose.model('Like', LikeSchema);