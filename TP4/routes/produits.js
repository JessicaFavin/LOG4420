var express = require("express");
var router = express.Router();
var Product = require('../model/product');

var categories = ["cameras", "consoles", "screens", "computers", "all"];
var criterias = ["price-asc", "price-dsc", "alpha-asc", "alpha-dsc"];

// récuperer tous les produits
router.get("/", function(req, res) {
    var category = req.query.category
    var criteria = req.query.criteria
    //valeurs par défaut
    if(!category) {
        category = "all";
    }
    if(!criteria) {
        criteria = "price-asc";
    }
    if(!categories.includes(category) || !criterias.includes(criteria)){
        //si les valeurs sont non-conformes -> 400
        res.status(400).json({});
    } else {
        //si les valeurs sont bonnes -> 200 + json produits
        Product.getProducts(function(products) {
            if(!products) {
                products = {};
            }
            res.status(200).json(products);
        }, category, criteria);
    }

});

// récuperer un produit par son id
router.get("/:id", function(req, res) {
    var id = req.params.id;
    Product.getProductById(function(product) {
        if(!product) {
            res.status(404).json({});
        } else {
            res.status(200).json(product);
        }
    }, id);
});

//ajouter un produit dans la bdd
router.post("/", function(req, res) {
    //récupère les variables envoyées
    var id = req.body.id;
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var category = req.body.category;
    var description = req.body.description;
    var features = req.body.features;
    //créé le produit en bdd
    //res.send("Test")
    Product.createProduct(function(ok){
        if(ok){
            res.status(201).json({});
        } else {
            res.status(400).json({});
        }
    }, id, name, price, image, category, description, features);
});


//supprimer un produit par son id
router.delete("/:id", function(req, res) {
    var id = req.params.id;
    Product.deleteProductById(function(http) {

        if(http===204) {
            res.status(204).json({});
        } else {
            res.status(404).json({});
        }

    }, id);
});

//supprimer un produit par son id
router.delete("/", function(req, res) {
    Product.deleteProducts(function(http) {
        res.status(204).json({});
    });
});

module.exports = router;
