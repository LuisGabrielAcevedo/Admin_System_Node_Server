const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name: { type: String, required: true },
    applicationCode: { type: String, required: true },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    type: { type: Schema.ObjectId, ref: 'ProductType', default: null },
    category: { type: Schema.ObjectId, ref: 'ProductCategory', default: null },
    description: { type: String, default: null },
    details: { type: String, default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null },
    profileImage: {
        fileName: { type: String, default: null },
        url: { type: String, default: 'https://www.taiwaniot.com.tw/wp-content/uploads/2016/06/product-default.png'},
        directory: { type: String, default: null }
    },
    images: [
        {
            fileName: { type: String, default: null },
            url: { type: String, default: null },
            directory: { type: String, default: null }
        }
    ],
    brand: { type: Schema.ObjectId, ref: 'Brand', default: null },
    active: { type: Boolean, default: true },
    locals: [{ type: Schema.ObjectId, ref: 'Local', default: [] }],
    // boxes: [{ type: Schema.ObjectId, ref: 'Box', default: [] }],
    price: { type: Number, default: 0 },
    unit: { type: String, default: null },
    pricePerLocal: { type: Boolean, default: false },
    pricePerLocalsData: [{ type: Schema.ObjectId, ref: 'PricePerLocal', default: [] }],
    tax: { type: Number, default: null },
    totalAvailable: { type: Number, default: 0 },
    // discount: { type: Schema.ObjectId, ref: 'DiscountPerProduct', default: null },
    vendor: { type: Schema.ObjectId, ref: 'Vendor', default: null },
    characteristics: { type: Object, default: null }
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