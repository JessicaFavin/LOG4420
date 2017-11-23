var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("index", { title: "Accueil", message: "accueil" });
});

router.get("/accueil", function(req, res) {
  res.render("index", { title: "Accueil", message: "accueil" });
});

router.get("/produits", function(req, res) {
  res.render("produits", { title: "Produits", message: "produits" });
});

router.get("/produit", function(req, res) {
  res.render("produit", { title: "Produit", message: "Ça semble fonctionner!" });
});

router.get("/contact", function(req, res) {
  res.render("contact", { title: "Contact", message: "contact" });
});

router.get("/panier", function(req, res) {
  res.render("panier", { title: "Panier", message: "Ça semble fonctionner!" });
});

router.get("/commande", function(req, res) {
  res.render("commande", { title: "Commande", message: "Ça semble fonctionner!" });
});

router.post("/confirmation", function(req, res) {
  res.render("confirmation", { title: "Confirmation", message: "" });
});


module.exports = router;
