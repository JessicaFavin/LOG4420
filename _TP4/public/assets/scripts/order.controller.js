var onlineShop = onlineShop || {};

/**
 * Controls the "order" view.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
(function($, shoppingCartService, ordersService) {
  "use strict";
  var orderForm = $("#order-form");

  /**
   * Creates an order when the form is submitted.
   *
   * @param event         The event associated with the form.
   * @returns {boolean}   TRUE if the data submitted are valid. FALSE otherwise.
   * @private
   */
  function _createOrder(event) {
    event.preventDefault();
    if (!orderForm.valid()) {
      return false;
    }
    shoppingCartService.getItems().done(function(items) {
      var order = {
        firstName: $("#first-name").val(),
        lastName: $("#last-name").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        products: items.map(function(item) {
          return {
            productId: item.product.id,
            quantity: item.quantity
          }
        })
      };
      ordersService.createOrder(order);
      shoppingCartService.removeAllItems();
      orderForm.unbind("submit").submit();
    });
    return true;
  }

  // Creates a custom validator for the credit card expiry.
  $.validator.addMethod('ccexp', function(value) {
    if (!value) {
      return false;
    }
    var regEx = /^(0[1-9]|1[0-2])\/(0[0-9]|[1-9][0-9])$/g;
    return regEx.test(value);
  }, "La date d'expiration de votre carte de crédit est invalide.");

  // Initializes the view.
  if (shoppingCartService.getItemsCount() <= 0) {
    $("article").html("<h1>Votre panier est vide!<h1>");
    return;
  }

  orderForm.validate({
    rules: {
      "phone": {
        required: true,
        phoneUS: true
      },
      "credit-card": {
        required: true,
        creditcard: true
      },
      "credit-card-expiry": {
        ccexp: true
      }
    }
  });
  orderForm.submit(_createOrder);

})(jQuery, onlineShop.shoppingCartService, onlineShop.ordersService);
