"use strict";

var shoppingCart = {
	count: 0,
	content: []
}

var idClient = 1;

var orderId = {
	firstname: "",
	lastname: "",
	id: idClient
}


$(document).ready(function() {
	
	//initialise le panier si non existant
	if (!localStorage.shoppingCart)
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
		
	//initialise la commande
	if (!localStorage.orderId)
		localStorage.setItem('orderId', JSON.stringify(orderId));
		
	//met a jour le compte du panier
	updateCount();
	
	//met en place la validation automatique du formulaire
	if($('#order-form')){
		$.validator.addMethod("creditCardExpiry", function(value, element) {
		  return this.optional( element ) || /^(1[0-2]|0[1-9])\/\d{2}$/.test( value );
		}, 'La date d’expiration de votre carte de crédit est invalide.');
		validateForm();
	}
	
	//met en place l'event listener lors de la commande
	$('#order-form').submit(function(e){
		//vide le panier
		shoppingCart = {
			count: 0,
			content: []
		}
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
		updateCount();
		
		//créé la commande
		orderId = JSON.parse(localStorage.orderId);
		idClient = orderId.id++;
		orderId = {
				firstname: $("#first-name").val(),
				lastname: $("#last-name").val(),
				id: idClient
		}
		localStorage.setItem('orderId', JSON.stringify(orderId));
	});

});

//condition de validation du formulaire
function validateForm(){
	$('#order-form').validate({
	    rules: {
	        "first-name": {
	            minlength: 2,
	            required: true
	        },
	        "last-name": {
	            minlength: 2,
	            required: true
	        },
	        email: {
	            required: true,
	            email: true
	        },
			phone: {
				required: true,
				phoneUS: true
			},
			"credit-card": {
				required: true,
				creditcard: true
			},
			"credit-card-expiry": {
				required: true,
				creditCardExpiry: true
			}
		},
		messages: {
			"credit-card-expiry": {
				creditCardExpiry: "La date d'expiration de votre carte de crédit est invalide."
			}
		}
	});
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
