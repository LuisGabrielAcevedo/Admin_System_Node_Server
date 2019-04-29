const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = Schema({
    followed: { type: Schema.ObjectId, ref: 'User', required: true },
    following: { type: Schema.ObjectId, ref: 'User', required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Follow', FollowSchema);