const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: [ true, 'the_field_user_is_required'] },
    company: { type: Schema.ObjectId, ref: 'Company', default: null },
    application: { type: Schema.ObjectId, ref: 'Application', required: [ true, 'the_field_application_is_required'] },
    profileImage: { type: Schema.ObjectId, ref: 'Image', required: [ true, 'the_field_company_is_required'] },
    images: [{ type: Schema.ObjectId, ref: 'Image', default: null }],
    coordinates: { type: String, default: null },
    message: { type: String, default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Post', PostSchema);