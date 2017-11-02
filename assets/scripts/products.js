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

$(document).ready(function() {
	//initialise le panier si non existant
	if (!localStorage.shoppingCart)
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
	//met a jour le compte du panier
	updateCount();
	
	//charge la liste des produits
	loadProductsList();
	
	//met en place l'event listener pour les boutons de catégories
	$("#product-categories > button").click(changeCategorie);

	//met en place l'event listener pour les boutons de critères
	$("#product-criteria > button").click(changeCriteria);
	

});

//recharge les produits en fonction de la catégorie sélectionnée
var changeCategorie = function (event) {
	$.ajax ({
		url: './data/products.json',
		dataType: 'json',
		success: function (data){
			var count = 0;
			var criteria = $("#product-criteria > .selected")[0].value;
			$("#product-categories > .selected").removeClass("selected");
			$("button[value="+event.target.value+"]").addClass("selected");
			if (criteria === "price-ascending")
				data = data.sort(sortProductsByAscendingPrice);
			if (criteria === "price-descending")
				data = data.sort(sortProductsByDescendingPrice);
			if (criteria === "name-ascending")
				data = data.sort(sortProductsByAscendingName);
			if (criteria === "name-descending")
				data = data.sort(sortProductsByDescendingName);
			$(".products").text("");
			$.each(data, function(product) {
				if (event.target.value === "all" || event.target.value === data[product].category)
				{
					$(".products").append(
					'<div class="product"><a href="./product.html?id='+data[product].id+'" title="En savoir plus..."><h2>' + data[product].name + '</h2><img alt="' + data[product].name + '" src="./assets/img/' + data[product].image +'"><p><small>Prix</small> ' + (data[product].price).toString().replace(".",",") + '&thinsp;$</p></a></div>'
					);
					count++;
				}
			});
			$("#products-count").text(count+" produits");
		}
	})
};

//recharge les produits en fonction du critère sélectionné
var changeCriteria = function (event) {
	$.ajax ({
		url: './data/products.json',
		dataType: 'json',
		success: function (data){
			var category = $("#product-categories > .selected")[0].value;
			$("#product-criteria > .selected").removeClass("selected");
			$("button[value="+event.target.value+"]").addClass("selected");
			if (event.target.value === "price-ascending")
				data = data.sort(sortProductsByAscendingPrice);
			if (event.target.value === "price-descending")
				data = data.sort(sortProductsByDescendingPrice);
			if (event.target.value === "name-ascending")
				data = data.sort(sortProductsByAscendingName);
			if (event.target.value === "name-descending")
				data = data.sort(sortProductsByDescendingName);
			$(".products").text("");
			$.each(data, function(product) {
				if(category === "all" || data[product].category === category)
				{
					$(".products").append(
					'<div class="product"><a href="./product.html?id='+data[product].id+'" title="En savoir plus..."><h2>' + data[product].name + '</h2><img alt="' + data[product].name + '" src="./assets/img/' + data[product].image +'"><p><small>Prix</small> ' + (data[product].price).toString().replace(".",",") + '&thinsp;$</p></a></div>'
					);
				}
			});
		}
	})
};

//charge la liste des produits
function loadProductsList() {
	$.ajax ({
		url: './data/products.json',
		dataType: 'json',
		success: function (data){
			data = data.sort(sortProductsByAscendingPrice);
			$.each(data, function(product) {
				$(".products").append(
				'<div class="product"><a href="./product.html?id='+data[product].id+'" title="En savoir plus..."><h2>' + data[product].name + '</h2><img alt="' + data[product].name + '" src="./assets/img/' + data[product].image +'"><p><small>Prix</small> ' + (data[product].price).toString().replace(".",",") + '&thinsp;$</p></a></div>'
				);
			});
		}
	});
}

/*------------------Fonctions de tri------------------*/

function sortProductsByAscendingPrice(a, b) {
	return ((a.price < b.price) ? -1 : ((a.price > b.price) ? 1 : 0));
}

function sortProductsByDescendingPrice(a, b) {
	return ((a.price > b.price) ? -1 : ((a.price < b.price) ? 1 : 0));
}

function sortProductsByAscendingName(a, b) {
	return ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
}

function sortProductsByDescendingName(a, b) {
	return ((a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : ((a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : 0));
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
