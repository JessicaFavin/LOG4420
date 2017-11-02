
"use strict";

var shoppingCart = {
	count: 0,
	content: []
}

var product = {
	name: '',
	price: 0,
	quantity: 0
}

var currentId = -1;



$(document).ready(function() {
	//initialise le panier si non existant
	if (!localStorage.shoppingCart)
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
	//met a jour le compte du panier
	updateCount();
	
	// si l'id n'est pas valide charge la page d'erreur sinon charge les infos du produit
	var sPageURL = decodeURIComponent(window.location.search.substring(0));
	var idIndex = sPageURL.indexOf("id");
	if(idIndex !== -1)
	{
		currentId = decodeURIComponent(window.location.search.substring(idIndex + 3));
		loadProduct(currentId);
	}
	//met en place l,event listener pour l'ajout d'item au panier
	$('#add-to-cart-form').submit(function(e) {
		e.preventDefault();
		submitCart();
		$("#dialog").stop().fadeIn(0, 1).delay(5000).fadeOut(0, 0);
	});
	

});

//Telecharge les produits, selectionne celui dont l'id est dans l'url
//met les infos du produits dans les balises concernées
function loadProduct(id) {
	$.ajax ({
		url: './data/products.json',
		dataType: 'json',
		success: function (data){
			var isFound = false;
			$.each(data, function(product) {
				if(data[product].id == id)
				{
					var features = "";
					$.each(data[product].features, function(feature) {
						features = features + '<li>' + data[product].features[feature] + '</li>';
					});
					$("#product-name").append(data[product].name);
					$("#product-image").attr("alt",data[product].name);
					$("#product-image").attr("src","./assets/img/"+data[product].image );
					$("#product-desc").append(data[product].description);
					$("#product-features").append(features);
					$("#product-price").append((data[product].price).toString().replace(".",",") + '&thinsp;$');
					isFound = true;
				}
			});
			if (!isFound) {
				$("#product-page").text("");
				$("#product-page").append('<h1>Page non trouvée!</h1>');
			}
		}
	})
};

//ajoute le nombre d'item demandé dans le panier
//avec les caractéristiaues trouvés dans le json téléchargé
function submitCart() {
	$.ajax ({
		url: './data/products.json',
		dataType: 'json',
		success: function (data){
			var amount = parseInt(document.getElementById("product-quantity").value);
			$.each(data, function(product) {
				if(data[product].id == currentId)
				{
					var content = JSON.parse(localStorage.shoppingCart).content;
					var newContent = [];
					for(var i = 0; i<amount; i++)
						newContent.push(data[product]);
					shoppingCart.content = content.concat(newContent);
				}
			});
			shoppingCart.count = shoppingCart.content.length
			localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
			updateCount();
		}
	})
}

//met à jour le compte du panier
var updateCount = function () {
	if (JSON.parse(localStorage.shoppingCart).count == 0)
		$('.shopping-cart > .count').hide();
	else {
		$('.shopping-cart > .count').text(JSON.parse(localStorage.shoppingCart).count);
		$('.shopping-cart > .count').show();
	}
}
