const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = Schema({
    name: { type: String, required: true },
    country: {type: Schema.ObjectId, ref: 'Country', required: true },
    logo: {
        fileName: { type: String, default: null },
        url: { type: String, default: null },
        directory: { type: String, default: 'https://urbanlandcompany.com/wp-content/uploads/2016/06/ulc-icon-default.png' }
    },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null },
    profileImage: {
        fileName: { type: String, default: null },
        url: { type: String, default: 'https://urbanlandcompany.com/wp-content/uploads/2016/06/ulc-icon-default.png' },
        directory: { type: String, default: null }
    },
    currency: { type: String, default: null },
    admin: { type: Schema.ObjectId, ref: 'User', default: null },
    application: { type: Schema.ObjectId, ref: 'Application', required: true },
    locals: [{ type: Schema.ObjectId, ref: 'Local', default: [] }]
});

module.exports = mongoose.model('Company', CompanySchema);

