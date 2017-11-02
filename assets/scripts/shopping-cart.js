"use strict";
var items = [];

//supprime tous les caractères non-alphanumériaue
var reg = new RegExp("[^a-zA-Z0-9]","g");

var shoppingCart = {
	count: 0,
	content: []
}

$(document).ready(function() {

	$('.count').hide();
	
	//initialise le panier si non existant
	if (!localStorage.shoppingCart)
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
	
	//si le panier est vide affiche un ;essage sinon affiche son contenu
	if (JSON.parse(localStorage.shoppingCart).count == 0){
		$('.shopping-cart-empty').show();
		$(".shopping-cart-not-empty").hide();
	} else {
		updateCount();
		$('.shopping-cart-empty').hide();
		$(".shopping-cart-not-empty").show();
		showCart();
	}
	
	//met en place les event listener des boutons X, +, -, vider
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
		
});

//affiche le contenu du panier sur la page
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

//permet la recherche dans le panier grace au nom de l'item
function findObjectsByKey(array, name) {
	var count = 0;
		
	for(var i = 0; i<array.length; i++){
		if(array[i].name === name)
			count++;
	}
	return count;
	
};

//tri dans l'ordre alphabétique
function sortProductsByAscendingName(a, b) {
	return ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
};

//met à jour le compte du panier
var updateCount = function () {
	if (JSON.parse(localStorage.shoppingCart).count == 0)
		$('.count').hide();
	else {
		$('.count').text(JSON.parse(localStorage.shoppingCart).count);
		$('.count').show();
	}
}

//met à jour le prix total du panier
function updateTotalAmount(){
	var total = 0;
	$.each(items, function(item) {
		total+=parseFloat(items[item].price);
	});
	$("#total-amount").text(total.toFixed(2).replace(".",",")).append('&thinsp;$');
}

//affiche le contenu du panier dans la table
function printItems() {
	var total = 0;
	$.each(items, function(item) {
		var removeIsDisabled = items[item].quantity == 1 ? "disabled=\"\"" : " ";
		$("tbody").append(
			'<tr id="'+ items[item].name.replace(reg,"") +'">' +
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
	$("#total-amount").text(total.toFixed(2).replace(".",",")).append('&thinsp;$');
	updateTotalAmount();
		
};

//diminue la quantite de l'item, change la valeur dans le tableau items
// dans l'objet shoppingCart et change le prix total pour l'item ainsi 
//que la quantité
function decreaseQuantity(event) {
	var newQuantity;
	var newPrice;
	for(var i = 0; i<items.length; i++){
			// Remove \" of products with screen size
			var itemName = items[i].name.replace("\"", "");
			if(itemName === event.currentTarget.value){
				if (items[i].quantity == 2){
					items[i].quantity--;
					items[i].price = items[i].unitPrice.toFixed(2);
					$(".remove-quantity-button").filter(function(){return this.value==itemName}).attr('disabled',true);
				}
				else if (items[i].quantity > 2){
					items[i].price -= items[i].unitPrice;
					items[i].quantity--;
				}
				
				newQuantity = items[i].quantity;
				newPrice = items[i].unitPrice*newQuantity;
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
		
		$('#'+event.currentTarget.value.replace(reg, '')+' .quantity').text(newQuantity.toString());
		$('#'+event.currentTarget.value.replace(reg, '')+' .price').text(newPrice.toFixed(2).replace(".",",")).append('&thinsp;$');
		
		updateTotalAmount();
		updateCount();
};

//augmente la quantite de l'item, change la valeur dans le tableau items
// dans l'objet shoppingCart et change le prix total pour l'item ainsi 
//que la quantité
function increaseQuantity(event) {
	var newQuantity;
	var newPrice;
	for(var i = 0; i<items.length; i++){
			// Remove \" of products with screen size
			var itemName = items[i].name.replace("\"", "");
			if(itemName === event.currentTarget.value){
				items[i].price += items[i].unitPrice;
				items[i].quantity++;
				newQuantity = items[i].quantity;
				newPrice = (items[i].unitPrice*newQuantity).toFixed(2);
				$(".remove-quantity-button").filter(function(){return this.value==itemName}).attr('disabled',false);
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
		
		$("#"+event.currentTarget.value.replace(reg, '')+" .quantity").text(newQuantity.toString());
		$('#'+event.currentTarget.value.replace(reg, '')+' .price').text(newPrice.toString().replace(".",",")).append('&thinsp;$');
		
		updateTotalAmount();
		updateCount();
};

//supprime l'item après confirmation et met à jour le prix total
function removeItem(event) {
	if (confirm("Voulez-vous supprimer le produit du panier ?")){
		
		//retire de items
		for(var i = 0; i<items.length; i++){
			// Remove \" of products with screen size
			var itemName = items[i].name.replace("\"", "");
			if(itemName === event.currentTarget.value){
				items.splice(i, 1);

				break;
			}
		}

		// Retire du panier
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
		
		//retire de la table
		$('#'+event.currentTarget.value.replace(reg, '')).remove();
		updateCount();

		if (shoppingCart.count == 0){
			$(".shopping-cart-not-empty").hide();
			$('.shopping-cart-empty').show();
		}
		updateTotalAmount();
	};
};

//vide le panier
function deleteAll() {
	if (confirm("Voulez-vous supprimer tous les produits du panier ?")){
		//vide le panier et l'enregistre dans le localstorage
		items = [];
		shoppingCart.content = [];
		shoppingCart.count = 0;
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
		//vide la table
		$("tbody").text("");
		//switch l'affichage pour celui du panier vide
		$(".shopping-cart-not-empty").hide();
		$('.shopping-cart-empty').show();
		//met a jour le chiffre du panier
		updateCount();
	}
};
