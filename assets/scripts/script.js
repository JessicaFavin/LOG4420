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

var updateCount = function () {
	if (JSON.parse(localStorage.shoppingCart).count == 0)
		$('.shopping-cart > .count').hide();
	else {
		$('.shopping-cart > .count').text(JSON.parse(localStorage.shoppingCart).count);
		$('.shopping-cart > .count').show();
	}
}
$(document).ready(function() {
	if (!localStorage.shoppingCart)
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

	updateCount();

	if ($(".active").text()==="Produits") {
		loadProductsList();
	}

	var sPageURL = decodeURIComponent(window.location.search.substring(0));
	var idIndex = sPageURL.indexOf("id");
	if(idIndex !== -1)
	{
		currentId = decodeURIComponent(window.location.search.substring(idIndex + 3));
		loadProduct(currentId);
	}

	$("#product-categories > button").click(loadCategories);

	$("#product-criteria > button").click(loadCriteria);

	$('#add-to-cart-form').submit(function(e) {
		e.preventDefault();
		submitCart();
		$("#dialog").stop().fadeIn(0, 1).delay(5000).fadeOut(0, 0);
	});
	
	if($("title").text()==="OnlineShop - Confirmation"){
		console.log("Confirmation");
		var orderId = JSON.parse(localStorage.orderId);
		$("#name").text(orderId.firstname+" "+orderId.lastname);
		$("#confirmation-number").text(orderId.id);
		console.log(orderId);
	}

});

var loadCategories = function (event) {
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

var loadCriteria = function (event) {
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
