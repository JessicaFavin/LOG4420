"use strict";

 var mongoose = require("mongoose");

 //--------------déplacés dans /model/product.js et /model/order.js-------------

var Schema = mongoose.Schema;

var Order = new Schema({
  id: { type: Number, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  products: Array
}, { versionKey: false });


var Product = new Schema({
  id: { type: Number, unique: true },
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  features: Array
}, { versionKey: false });

mongoose.model("Order", Order);
mongoose.model("Product", Product);

mongoose.Promise = global.Promise;

// TODO: Initialiser la connexion avec le "connect string" de votre base de données.
mongoose.connect("mongodb://admin:admin@ds257495.mlab.com:57495/onlineshopping", { useMongoClient: true });
