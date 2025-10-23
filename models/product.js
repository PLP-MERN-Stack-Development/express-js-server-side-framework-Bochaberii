const mongoose = require('mongoose');

//Define schema (rules to follow to create collections in the database)

const ProductSchema = new mongoose.Schema ({

    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true }

}, { timestamps: true });

//Create the model : represents the collections aka tables

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
