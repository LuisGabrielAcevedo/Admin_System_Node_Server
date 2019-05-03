const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = Schema({
    fileName: { type: String, default: null },
    associatedId: { type: String, default: null },
    type: { type: String, default: null },
    path: { type: String, default: null },
    url: { type: String, default: null },
    directory: { type: String, default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Image', ImageSchema);