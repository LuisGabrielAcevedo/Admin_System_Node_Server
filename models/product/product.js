const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name: { type: String, required: true },
    application: { type: Schema.ObjectId, ref: 'Application', required: true },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    type: { type: Schema.ObjectId, ref: 'ProductType', default: null },
    category: { type: Schema.ObjectId, ref: 'ProductCategory', default: null },
    description: { type: String, default: null },
    details: { type: String, default: null },
    profileImage: { type: Schema.ObjectId, ref: 'Image', default: null },
    images: [{ type: Schema.ObjectId, ref: 'Image', default: null }],
    brand: { type: Schema.ObjectId, ref: 'Brand', default: null },
    active: { type: Boolean, default: true },
    onlineSale: { type: Boolean, default: true },
    stores: [{ type: Schema.ObjectId, ref: 'Store', default: [] }],
    boxes: [{ type: Schema.ObjectId, ref: 'Box', default: [] }],
    price: { type: Number, default: 0 },
    unit: { type: String, default: null },
    pricePerStore: { type: Boolean, default: false },
    pricePerStoresData: [{ type: Schema.ObjectId, ref: 'PricePerStore', default: [] }],
    tax: { type: Number, default: null },
    totalAvailable: { type: Number, default: 0 },
    vendor: { type: Schema.ObjectId, ref: 'Vendor', default: null },
    characteristics: { type: Object, default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Product', ProductSchema);

const carExample = {
    "name": "Chevrolet Onix Sedán 2019",
    "company": "5c4e4cecb9b746891891e7f3",
    "type": "1",
    "category": "5c4e4d2eb9b746891891e7f4",
    "price": 35990000,
    "unit": "unity",
    "brand": "12121221212121",
    "characteristics": {
        "colors": ["red"],
        "engine": "S-TEC II 1.2 liters, 16 valves DOHC",
        "chassis": "sgajhshs17272-2ww",
        "power": "80.5 horses @ 6,400 rpm",
        "torque": "108 Nm @ 4,800 rpm",
        "transmission": "5-speed mechanics",
        "registration": null,
        "model": "Onix Sedán",
        "condition": "new",
        "year": "2019"
    }
} 