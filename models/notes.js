const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = Schema({
    associatedId: { type: String, required: true },
    title: { type: String, required: true },
    note: { type: String, required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Note', NoteSchema);