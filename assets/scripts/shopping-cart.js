"use strict";
var items = [];

var shoppingCart = {
	count: 0,
	content: []
}

var totalPrice = function (content) {
		var total = 0;
		content.forEach(function(product) {
			total += product.price;
		});
		return total;
}

var updateCount = function () {
	if (JSON.parse(localStorage.shoppingCart).count == 0)
		$('.count').hide();
	else {
		$('.count').text(JSON.parse(localStorage.shoppingCart).count);
		$('.count').show();
	}
}

$(document).ready(function() {
	//updateCount();
	$('.count').hide();
	if (JSON.parse(localStorage.shoppingCart).count == 0){
		$(".shopping-cart-not-empty").hide();
		$('.count').hide();
		$('.shopping-cart-empty').show();
	}
	else {
		updateCount();
		$('.shopping-cart-empty').hide();
		$(".shopping-cart-not-empty").show();
		showCart();
	}
		
});

function showCart() {
	var content = JSON.parse(localStorage.shoppingCart).content;
	$.each(content, function(product) {
		if(findObjectsByKey(items, content[product].name) === 0){
			var count = findObjectsByKey(content, content[product].name);
			items.push({id: content[product].id, name: content[product].name, quantity: count, unitPrice: content[product].price, price: Math.round(content[product].price * count * 100) / 100});
		}
	});
	
	items = items.sort(sortProductsByAscendingName);
	
	printItems();

	
};

function findObjectsByKey(array, name) {
	var count = 0;
		
	for(var i = 0; i<array.length; i++){
		if(array[i].name === name)
			count++;
	}
	return count;
	
};

function sortProductsByAscendingName(a, b) {
	return ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
};

function removeItem(event) {
	if (confirm("Voulez-vous supprimer le produit du panier ?")){
		for(var i = 0; i<items.length; i++){
			// Remove \" of products with screen size
			var itemName = items[i].name.replace("\"", "");
			if(itemName === event.currentTarget.value){
				items.splice(i, 1);

				break;
			}
		}

		// Remove from cart
		var content = JSON.parse(localStorage.shoppingCart).content;
		var newContent = [];
		for (var i = 0; i < content.length; i++){
			var productName = content[i].name.replace("\"", "");
			if(productName !== event.currentTarget.value){
				newContent.push(content[i]);
			}
		}
		shoppingCart.content = newContent;
		shoppingCart.count = shoppingCart.content.length;
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

		$("tbody").text("");
		printItems();
		updateCount();

		if (shoppingCart.count == 0){
			$(".shopping-cart-not-empty").hide();
			$('.shopping-cart-empty').show();
		}
	};
};

function printItems() {
	var total = 0;
	$.each(items, function(item) {
		var removeIsDisabled = items[item].quantity == 1 ? "disabled=\"\"" : " ";
		$("tbody").append(
			'<tr id="'+ items[item].name +'">' +
			'<td><button class="remove-item-button" value="'+items[item].name+'" title="Supprimer"><i class="fa fa-times"></i></button></td>' +
			'<td><a href="./product.html?id='+items[item].id+'">'+items[item].name+'</a></td>' +
			'<td>'+(items[item].unitPrice).toString().replace(".",",")+'&thinsp;$</td>' +
			'<td>' +
			  '<div class="row">' +
				'<div class="col">' +
				  '<button title="Retirer" class="remove-quantity-button" value="'+ items[item].name +'" ' + removeIsDisabled +'"><i class="fa fa-minus"></i></button>' +
				'</div>' +
				'<div class="col quantity">'+(items[item].quantity).toString()+'</div>' +
				'<div class="col">' +
				  '<button title="Ajouter" class="add-quantity-button" value="'+ items[item].name + '"><i class="fa fa-plus"></i></button>' +
				'</div>' +
			  '</div>' +
			'</td>' +
			'<td class="price">'+(items[item].price).toString().replace(".",",")+'&thinsp;$</td>' +
		  '</tr>'
		);
		total+=items[item].price;
	});
	$("#total-amount").text((Math.round(total * 100) / 100).toString().replace(".",",")).append('&thinsp;$');

	$(".remove-item-button").click(function(event) {
		removeItem(event);
		});

	$(".remove-quantity-button").click(function(event) {
		decreaseQuantity(event);
		});

	$(".add-quantity-button").click(function(event) {
		increaseQuantity(event);
		});

	$("#remove-all-items-button").click(function() {
		deleteAll();
		});
};

function decreaseQuantity(event) {
	for(var i = 0; i<items.length; i++){
			// Remove \" of products with screen size
			var itemName = items[i].name.replace("\"", "");
			if(itemName === event.currentTarget.value){
				if (items[i].quantity == 2){
					items[i].quantity--;
					items[i].price = items[i].unitPrice;
					$(".remove-quantity-button").filter(function(){return this.value==itemName}).attr('disabled','disabled');
				}
				else if (items[i].quantity > 2){
					items[i].price -= items[i].unitPrice;
					items[i].quantity--;
				}
				break;
			}
		}

		// Remove one from cart
		var content = JSON.parse(localStorage.shoppingCart).content;
		var newContent = [];
		var removedOne = false;
		for (var i = 0; i < content.length; i++){
			var productName = content[i].name.replace("\"", "");
			if(productName !== event.currentTarget.value || removedOne){
				newContent.push(content[i]);
			}
			else if (!removedOne)
				removedOne = true;
		}
		shoppingCart.content = newContent;
		shoppingCart.count = shoppingCart.content.length;
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

		$("tbody").text("");
		printItems();
		updateCount();
};

function increaseQuantity(event) {
	for(var i = 0; i<items.length; i++){
			// Remove \" of products with screen size
			var itemName = items[i].name.replace("\"", "");
			if(itemName === event.currentTarget.value){
				items[i].price += items[i].unitPrice;
				items[i].quantity++;
				break;
			}
		}

		// Add one to cart
		var content = JSON.parse(localStorage.shoppingCart).content;
		var newContent = content;
		var addedOne = false;
		$.each
		for (var i = 0; i < content.length; i++){
			var productName = content[i].name.replace("\"", "");
			if(productName === event.currentTarget.value){
				newContent.push(content[i]);
				break;
			}
		}
		shoppingCart.content = newContent;
		shoppingCart.count = shoppingCart.content.length;
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

		$("tbody").text("");
		printItems();
		updateCount();
};

function deleteAll() {
	console.log("deleteAll");
	if (confirm("Voulez-vous supprimer tous les produits du panier ?")){
		console.log("I went there");
		items = [];
		shoppingCart.content = [];
		shoppingCart.count = 0;
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
		$("tbody").text("");
		$(".shopping-cart-not-empty").hide();
		$('.shopping-cart-empty').show();
		updateCount();
	} else {
			console.log("I did not supress anything");
	}
};
