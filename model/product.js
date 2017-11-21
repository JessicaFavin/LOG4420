var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//categories existantes
var categories = ["cameras", "consoles", "screens", "computers", "all"];

var idExistsBoolean = false;

//creation du model mongoose Product et exports en même temps
var Product = module.exports = mongoose.model("Product", new Schema({
  id: { type: Number, unique: true },
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  features: Array
}, { versionKey: false }));

//take category and criteria and check if allowed
//and add the restriction???
//tri après récupération
module.exports.getProducts = function(callback, category, criteria) {
    if(category==="all"){
        Product.find(function(error, products) {
            if(error) {
                throw error;
            }
            products = sortByCriteria(products, criteria);
            callback(products);
        });
    } else {
        Product.find({'category':category}, function(error, products) {
            if(error) {
                throw error;
            }
            products = sortByCriteria(products, criteria);
            callback(products);
        });
    }
}

//fonction de tri des produits
var sortByCriteria = function(data, criteria) {
    if (criteria === "price-asc")
		return data.sort(function(a, b) {
        	return ((a.price < b.price) ? -1 : ((a.price > b.price) ? 1 : 0));
        });
	if (criteria === "price-dsc")
		return data.sort(function(a, b) {
        	return ((a.price > b.price) ? -1 : ((a.price < b.price) ? 1 : 0));
        });
	if (criteria === "alpha-asc")
		return data.sort(function(a, b) {
        	return ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
        });
	if (criteria === "alpha-dsc")
		return data.sort(function(a, b) {
        	return ((a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : ((a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : 0));
        });
}

module.exports.getProductById = function(callback, id) {
    Product.findOne({'id':id}, function(error, product) {
        if(error) {
            throw error;
        }
        callback(product);
    });
}

//créer le produit dans la db en verifiant que les valeurs sont conformes
module.exports.createProduct = function(callback, id, name, price, image, category, description, features) {
    //check ID
    Product.getProductById(function(product) {
        if(product) {
            callback(false);
        } else {
            var idExists =  false;
            //id = parseInt(id);
            var idType = (typeof id === 'number');
            //check name
            var nameType = (typeof name === 'string');
            //check price
            //price = parseInt(price);
            var priceType = (typeof price === 'number');
            //check image
            var imageType = (typeof image === 'string');
            //check category
            var categoryType = (typeof category === 'string');
            var categoryIsValid = categories.includes(category);
            //check description
            var descriptionType = (typeof description === 'string');
            //check features
            var featuresType = Array.isArray(features);
            //check features content
            //var featuresIterator = features.values();
            var featuresContentType = true;
            for (var feature of features) {
              if(typeof feature !== 'string'){
                  featuresContentType = false;
              }
            }
            //check that everything is true
            if(!idExists && idType && nameType && priceType && imageType && categoryType && categoryIsValid && descriptionType && featuresType && featuresContentType){
                //créé le produit dans la bdd

                Product.create({'id': id, 'name': name, 'price': price, 'image': image,
                 'category': category, 'description': description, 'features': features},
                 function(err) {
                    if(err){
                        throw err;
                    }
                });
                //envoi (true)
                callback(true);
            } else {
                //envoi (false)
                callback(false);
            }
        }

    }, id.toString());


}

module.exports.deleteProductById = function(callback, id) {
    Product.getProductById(function(product) {
        if(product) {
            Product.remove({'id':id}, function(error, product) {
                if(error) {
                    throw error;
                }
                callback(204);
            });
        } else {
            callback(404);
        }
    }, id);
}

//supprime tous les produits de la collection
module.exports.deleteProducts = function(callback) {
    Product.remove(function(error, product) {
        if(error) {
            throw error;
        }
        callback(204);
    });

}
