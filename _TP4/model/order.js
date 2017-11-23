var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Product = require('../model/product');

var orderSchema = new Schema({
  id: { type: Number, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  products: Array
}, { versionKey: false });

var Order =  module.exports = mongoose.model("Order", orderSchema);

module.exports.getOrders = function(callback) {
    Order.find(function(error, orders) {
        if(error) {
            throw error;
        }
        callback(orders);
    });
}

module.exports.getOrderById = function(callback, id) {
    Order.findOne({"id": id}, function(error, order){
        if(error) {
            throw error;
        }
        callback(order);
    });
}

module.exports.createOrder = function(callback, id, firstName, lastName, email, phone, products){
    Order.getOrderById(function(order){
        //l'id existe déjà
        if(order) {
            callback(false);
        } else {
            var idType = (typeof id === 'number');
            var firstnameType = (typeof firstName === 'string');
            var firstNameNotEmpty = (firstName!=="");
            var lastnameType = (typeof lastName === 'string');
            var lastNameNotEmpty = (lastName!=="");
            var emailValid = validateEmail(email)
            var phoneValid = validatePhone(phone);
            var productsType = Array.isArray(products);
            Product.distinct('id', function(error, allIds){
                if(error){
                    throw error;
                }
                var productsContentType = true;
                var allIdsIn = true;
                //need to check every product exists in the data base....
                for (var product of products) {
                    if(typeof product.id !== 'number' || typeof product.quantity !== 'number'){
                      productsContentType = false;
                    }
                    //
                    if(!allIds.includes(product.id)){
                        //si l'id produit n'existe pas
                        allIdsIn = false;
                    }
                }
                if(idType && firstnameType && firstNameNotEmpty && lastnameType
                    && lastNameNotEmpty && emailValid && phoneValid && productsType
                    && productsContentType && allIdsIn){
                    Order.create({"id": id, "firstName": firstName, "lastName": lastName,
                    "email": email, "phone": phone, "products": products}, function(err) {
                       if(err){
                           throw err;
                       }
                       callback(true);
                   });
               } else {
                   callback(false);
               }
           });
        }
    }, id.toString());
}

function validateEmail(mail){
 return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
}

function validatePhone(phone){
    return (/\D*([2-9]\d{2})(\D*)([2-9]\d{2})(\D*)(\d{4})\D*/.test(phone));
}

module.exports.deleteOrderById = function(callback, id){
    Order.getOrderById(function(order){
        if(order){
            Order.remove({'id':id}, function(error) {
                if(error) {
                    throw error;
                }
                callback(204);
            });
        } else {
            callback(404);
        }
    },id);
}

module.exports.deleteOrders = function(callback){
    Order.remove(function(error) {
        if(error) {
            throw error;
        }
        callback(204);
    });
}
