const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = Schema({
    followed: { type: Schema.ObjectId, ref: 'User', required: true },
    following: { type: Schema.ObjectId, ref: 'User', default: null },
    company: { type: Schema.ObjectId, ref: 'Company', default: null },
    application: { type: Schema.ObjectId, ref: 'Application', default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Follow', FollowSchema);