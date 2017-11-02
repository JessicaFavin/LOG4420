"use strict";

var shoppingCart = {
	count: 0,
	content: []
}

var idClient = 0;

var orderId = {
	firstname: "",
	lastname: "",
	id: idClient
}

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
	if (!localStorage.orderId)
		localStorage.setItem('orderId', JSON.stringify(orderId));

	updateCount();
	
	var sPageURL = decodeURIComponent(window.location.search.substring(0));
	var idIndex = sPageURL.indexOf("id");
	if(idIndex !== -1)
	{
		currentId = decodeURIComponent(window.location.search.substring(idIndex + 3));
		loadProduct(currentId);
	}
	
	if($('#order-form')){
		$.validator.addMethod("creditCardExpiry", function(value, element) {
		  return this.optional( element ) || /^(1[0-2]|0[1-9])\/\d{2}$/.test( value );
		}, 'La date d’expiration de votre carte de crédit est invalide.');
		validateForm();
	}
	$('#order-form').submit(function(e){
		//empty the cart
		shoppingCart = {
			count: 0,
			content: []
		}
		localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
		updateCount();
		//create the order
		orderId = JSON.parse(localStorage.orderId);
		idClient = ++orderId.id;
		orderId = {
				firstname: $("#first-name").val(),
				lastname: $("#last-name").val(),
				id: idClient
		}
		localStorage.setItem('orderId', JSON.stringify(orderId));
	});

});

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
