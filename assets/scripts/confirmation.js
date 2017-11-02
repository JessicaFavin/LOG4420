"use strict";

$(document).ready(function() {
	//met a jour le compte du panier
	updateCount();
	
	//Affiche le nom de l'acheteur et son numéro de commande
	var orderId = JSON.parse(localStorage.orderId);
	$("#name").text(orderId.firstname+" "+orderId.lastname);
	$("#confirmation-number").text(orderId.id);
	

});

//met à jour le compte du panier
var updateCount = function () {
	if (JSON.parse(localStorage.shoppingCart).count == 0)
		$('.shopping-cart > .count').hide();
	else {
		$('.shopping-cart > .count').text(JSON.parse(localStorage.shoppingCart).count);
		$('.shopping-cart > .count').show();
	}
}
