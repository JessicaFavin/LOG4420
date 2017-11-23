var onlineShop = onlineShop || {};

/**
 * Defines a service to manage the shopping cart.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
onlineShop.shoppingCartService = (function($, productsService) {
  "use strict";

  var self = {};
  var items = {};
  var cartsPromise;
  /**
   * Adds an item in the shopping cart.
   *
   * @param productId   The ID associated with the product to add.
   * @param [quantity]  The quantity of the product.
   */
  self.addItem = function(productId, quantity) {
    if (productId === undefined) {
      throw new Error("The specified product ID is invalid.")
    }
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      quantity = 1;
    }
    
    if (!cartsPromise) {
      cartsPromise = 
        jQuery.ajax({
          url: "/api/shopping-cart/"+productId,
          type: "GET",
          dataType: "json",
          contentType: "application/json",
          statusCode: {
            404: function() {
              jQuery.ajax({
                url: "/api/shopping-cart",
                type: "POST",
                data: JSON.stringify({"productId": productId, "quantity": quantity}),
                contentType: "application/json",
                success: function() {
                  items[productId] = quantity;
                }
              })
              //reload page cause otherwise error 404 blocks further updates/actions
              //window.location.reload(false); 
            }
          },
          success: function(data) {
            self.updateItemQuantity(productId, self.getItemQuantity(productId) + quantity);
            //reload page cause otherwise further updates/actions are blocked ??
            //window.location.reload(false);
          }
        }
      );
    }
    
  };

  /**
   * Gets the items in the shopping cart.
   *
   * @returns {jquery.promise}    A promise that contains the list of items in the shopping cart.
   */
  self.getItems = function() {
    return productsService.getProducts("alpha-asc").then(function(products) {
      return products.filter(function(product) {
        return items.hasOwnProperty(product.id) && items[product.id] !== undefined;
      }).map(function(product) {
        return {
          product: product,
          quantity: items[product.id],
          total: product.price * items[product.id]
        };
      });
    });
  };

  /**
   * Gets the items count in the shopping cart.
   *
   * @returns {jquery.promise}  The items count.
   */
  self.getItemsCount = function() {
    return self.getItems().then(function(items) {
      var total = 0;
      for (var productId in items) {
        if (items.hasOwnProperty(productId) && items[productId]) {
          total += items[productId].quantity;
        }
      }
      return total;
      });
  };

  /**
   * Gets the quantity associated with an item.
   *
   * @param productId   The product ID associated with the item quantity to retrieve.
   * @returns {*}
   */
  self.getItemQuantity = function(productId) {
    return items[productId] || 0;
  };

  /**
   * Gets the total amount of the products in the shopping cart.
   *
   * @returns {jquery.promise}    A promise that contains the total amount.
   */
  self.getTotalAmount = function() {
    return self.getItems().then(function(items) {
      var total = 0;
      items.forEach(function(item) {
        if (item) {
          total += item.total;
        }
      });
      return total;
    });
  };

  /**
   * Updates the quantity associated with a specified item.
   *
   * @param productId   The product ID associated with the item to update.
   * @param quantity    The item quantity.
   */
  self.updateItemQuantity = function(productId, quantity) {
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      throw new Error("The specified quantity is invalid.")
    }
    if (items[productId]) {
      jQuery.ajax({
        url: "/api/shopping-cart/" + productId,
        type: "PUT",
        data: JSON.stringify({"quantity": quantity}),
        contentType: "application/json",
        success: function () {
          items[productId] = quantity;
        }
      })
    }
  };

  /**
   * Removes the specified item in the shopping cart.
   *
   * @param productId   The product ID associated with the item to remove.
   */
  self.removeItem = function(productId) {
    jQuery.ajax({
      url: "/api/shopping-cart/" + productId,
      type: "DELETE",
      contentType: "application/json",
      success: function () {
        items[productId] = undefined;
      }
    })
  };

  /**
   * Removes all the items in the shopping cart.
   */
  self.removeAllItems = function() {
    jQuery.ajax({
      url: "/api/shopping-cart/",
      type: "DELETE",
      contentType: "application/json",
      success: function () {
        items = {};
      }
    })
  };

  // Initializes the shopping cart.
  if (Object.keys(items).length === 0 && items.constructor === Object) {
    jQuery.ajax({
      url: "/api/shopping-cart/",
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      success: function(data) {
        data.forEach(function(i) {
          items[i.productId] = i.quantity;
        })
      }
    });
  }

  return self;
})(jQuery, onlineShop.productsService);
