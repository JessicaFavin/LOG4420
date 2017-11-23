var express = require("express");
var router = express.Router();
var Product = require('../model/product');
var sess = require('express-session');
var session;

// récuperer tous les éléments du panier
router.get("/", function(req, res) {
    var session = req.session;
    var cart = session.cart;
    if(!cart){
        cart = [];
    }
    res.status(200).send(cart);
});

// récuperer un élément par id
router.get("/:productId", function(req, res) {
    var productId = req.params.productId;
    var id = parseInt(productId);
    var session = req.session;
    var cart = session.cart;
    if(!cart){
        cart = [];
    }

    var found = false;
    //parcours du panier pour voir si le produit y est déjà
    cart.forEach(function(c) {
        if(c.productId === id){
            found = true;
            res.status(200).json(c);
        }
    });

    if(!found){
        res.status(404).json({});
    }
});

//ajouter un item dans le panier
router.post("/", function(req, res) {
    var session = req.session;
    var cart = session.cart;
    if(!cart){
        cart = [];
    }
    //récupère les variables envoyées
    var productId = req.body.productId;
    var quantity = req.body.quantity;
    //verifie les types et la validité de la quantité
    if(typeof productId!=="number" || typeof quantity !== "number" || quantity<=0){
        res.status(400).json({});
    } else {
        Product.getProductById(function(product){
            //si le produit existe
            if(product){
                //si le panier n'est pas vide
                if(cart!==[]){
                    var found = false;
                    //parcours du panier pour voir si le produit y est déjà
                    cart.forEach(function(c) {
                        //s'il y est on change le booleen found à true
                        if(c.productId === productId){
                            found = true;
                        }
                    });
                    //s'il n'y est pas on ajoute le produit et sa quantité
                    if(!found){
                        cart = cart.concat([{"productId": productId, "quantity": quantity}]);
                        //sauvegarde le panier dans la session
                        session.cart = cart;
                        res.status(201).json({});
                    } else {
                        //le produit est déjà dans le panier
                        res.status(400).json({});
                    }
                } else {
                    //si le panier est vide on ajoute le produit et sa quantité
                    cart = [{"productId": productId, "quantity": quantity}];
                    //sauvegarde le panier dans la session
                    session.cart = cart;
                    res.status(201).json({});
                }

            } else {
                //si le produit n'existe pas
                res.status(400).json({});
            }
        }, productId);
    }
});

//augmenter la quantité d'un item dans le panier
router.put("/:productId", function(req, res) {
    var session = req.session;
    var cart = session.cart;
    if(!cart){
        cart = [];
    }
    //récupère les variables envoyées
    var productId = req.params.productId;
    var quant = req.body.quantity;
    var id = parseInt(productId);
    //verifie les types et la validité de la quantité
    if(typeof id!=="number" || typeof quant !== "number" || quant<=0){
        return res.status(400).json({});
    }
    //si le panier n'est pas vide
    if(cart!==[]){
        var found = false;
        //parcours du panier pour voir si le produit y est déjà
        cart.forEach(function(c) {
            //s'il y est on change le booleen found à true et augmente la quantité
            if(c.productId === id){
                found = true;
                c.quantity = quant;
                session.cart = cart;
                res.status(204).json({});
            }
        });
        if(!found){
            res.status(404).json({});
        }
    }
});

router.delete("/", function(req, res) {
    var session = req.session;
    session.cart = [];
    res.status(204).json({});
});

router.delete("/:productId", function(req, res) {
    var productId = req.params.productId;
    var id = parseInt(productId);
    var session = req.session;
    var cart = session.cart;
    if(!cart){
        cart = [];
    }

    var found = false;
    //parcours du panier pour voir si le produit y est
    cart.forEach(function(c) {
        if(c.productId === id){
            found = true;
            cart.splice(cart.indexOf(c), 1);
            session.cart = cart;
            return res.status(204).json({});
        }
    });

    if(!found){
        res.status(404).json({});
    }
});

module.exports = router;
