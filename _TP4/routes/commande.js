var express = require("express");
var router = express.Router();
var Order = require('../model/order');

var categories = ["cameras", "consoles", "screens", "computers", "all"];
var criterias = ["price-asc", "price-dsc", "alpha-asc", "alpha-dsc"];

// récuperer toutes les commandes de la bdd
router.get("/", function(req, res) {
    Order.getOrders(function(orders) {
        if(!orders) {
            orders = {};
        }
        res.status(200).send(orders);
    });
})

router.get("/:id", function(req, res){
    var id = req.params.id;
    Order.getOrderById(function(order){
        if(!order){
            res.status(404).send({});
        } else {
            res.status(200).send(order);
        }
    }, id);
})

router.post("/", function(req, res){
    var id = req.body.id;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var phone = req.body.phone;
    var products = req.body.products;
    if(typeof id !== "number"){
        res.status(400).send({});
    } else {
        Order.createOrder(function(ok) {
            if(ok){
                res.status(201).send({});
            } else {
                res.status(400).send({});
            }
        }, id, firstName, lastName, email, phone, products);
    }
})

router.delete("/:id", function(req, res){
    var id = req.params.id;
    Order.deleteOrderById(function(http){
        if(http===204){
            res.status(204).send({});
        } else {
            res.status(404).send({});
        }
    }, id);
})

router.delete("/", function(req, res){
    Order.deleteOrders(function(){
        res.status(204).send({});
    });
})

module.exports = router;
