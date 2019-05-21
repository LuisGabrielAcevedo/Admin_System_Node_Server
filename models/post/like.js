const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = Schema({
	user: { type: Schema.ObjectId, ref: 'User' },
	post: { type: Schema.ObjectId, ref: 'Publication' },
	createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Like', LikeSchema);