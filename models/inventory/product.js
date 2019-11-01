const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema({
  name: { type: String, required: true },
  company: { type: Schema.ObjectId, ref: "Company", required: true },
  stores: [{ type: Schema.ObjectId, ref: "Store", default: [] }],
  description: { type: String, default: null },
  details: { type: String, default: null },
  prices: [{ type: Schema.ObjectId, ref: "Price", default: [] }],
  unit: { type: String, default: null },
  type: { type: Schema.ObjectId, ref: "ProductType", default: null },
  category: { type: Schema.ObjectId, ref: "ProductCategory", default: null },
  brand: { type: Schema.ObjectId, ref: "Brand", default: null },
  vendor: { type: Schema.ObjectId, ref: "Vendor", default: null },
  characteristics: { type: Object, default: null },
  thumbnail: { type: Schema.ObjectId, ref: "Image", default: null },
  pictures: [{ type: Schema.ObjectId, ref: "Image", default: null }],
  quantityAvailable: { type: Number, default: 0 },
  calification: { type: Number, default: 0 },
  barcode: { type: String, default: null },
  requireInventory: { type: Boolean },
  requireInventoryByBoxes: { type: Boolean },
  isActive: { type: Boolean },
  isOnlineSale: { type: Boolean },
  basePrice: { type: Number, default: 0 },
  createdAt: { type: String, default: null },
  updatedAt: { type: String, default: null },
  deletedAt: { type: String, default: null }
});

module.exports = mongoose.model("Product", ProductSchema);

const carExample = {
  name: "Chevrolet Onix Sedán 2019",
  company: "5c4e4cecb9b746891891e7f3",
  type: "1",
  category: "5c4e4d2eb9b746891891e7f4",
  price: 35990000,
  unit: "unity",
  brand: "12121221212121",
  characteristics: {
    colors: ["red"],
    engine: "S-TEC II 1.2 liters, 16 valves DOHC",
    chassis: "sgajhshs17272-2ww",
    power: "80.5 horses @ 6,400 rpm",
    torque: "108 Nm @ 4,800 rpm",
    transmission: "5-speed mechanics",
    registration: null,
    model: "Onix Sedán",
    condition: "new",
    year: "2019"
  }
};
