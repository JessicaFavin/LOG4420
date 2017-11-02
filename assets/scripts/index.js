"use strict";

var shoppingCart = {
	count: 0,
	content: []
}


$(document).ready(function() {
	//initialise le panier si non existant
	if (!localStorage.shoppingCart)
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
	//met a jour le compte du panier
	updateCount();
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
