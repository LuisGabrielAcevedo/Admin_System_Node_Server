const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User', default: null },
    company: { type: Schema.ObjectId, ref: 'Company', default: null },
    application: { type: Schema.ObjectId, ref: 'Application', default: null },
    profileImage: { type: Schema.ObjectId, ref: 'Image', default: null },
    images: [{ type: Schema.ObjectId, ref: 'Image', default: null }],
    coordinates: { type: String, default: null },
    message: { type: String, default: null },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },   
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Post', PostSchema);