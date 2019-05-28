const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = Schema({
	user: { type: Schema.ObjectId, ref: 'User', default: null },
    post: { type: Schema.ObjectId, ref: 'Post', default: null },
    comment: { type: String, required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Comment', CommentSchema);