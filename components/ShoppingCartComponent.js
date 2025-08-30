const BasePage = require('../pages/BasePage');

/**
 * SHOPPING CART COMPONENT
 * Reusable component for shopping cart
 */
class ShoppingCartComponent extends BasePage {
  constructor(page) {
    super(page);
    
    // Define selectors for shopping cart
    this.selectors = {
      cartContainer: '.cart, #shopping-cart, .shopping-cart',
      cartItems: '.cart-item, .item',
      cartItemName: '.item-name, .product-name',
      cartItemPrice: '.item-price, .product-price',
      cartItemQuantity: '.item-quantity, .quantity',
      cartItemTotal: '.item-total, .line-total',
      increaseQuantityBtn: '.quantity-increase, .qty-plus, .increase',
      decreaseQuantityBtn: '.quantity-decrease, .qty-minus, .decrease',
      removeItemBtn: '.remove-item, .delete-item, .remove',
      cartTotal: '.cart-total, .total-amount',
      cartSubtotal: '.cart-subtotal, .subtotal',
      cartTax: '.cart-tax, .tax',
      cartShipping: '.cart-shipping, .shipping',
      cartItemCount: '.cart-count, .item-count',
      emptyCartMessage: '.empty-cart, .cart-empty',
      checkoutButton: '.checkout-btn, .proceed-checkout',
      continueShoppingBtn: '.continue-shopping',
      cartIcon: '.cart-icon, .shopping-cart-icon',
      cartBadge: '.cart-badge, .cart-count-badge'
    };
  }

  /**
   * Open shopping cart
   */
  async openCart() {
    if (await this.isElementVisible(this.selectors.cartIcon)) {
      await this.clickElement(this.selectors.cartIcon);
    }
  }

  /**
   * Close shopping cart
   */
  async closeCart() {
    // Can click outside or close button depending on implementation
    await this.page.keyboard.press('Escape');
  }

  /**
   * Get number of items in cart
   * @returns {Promise<number>} Number of items
   */
  async getCartItemCount() {
    if (await this.isElementVisible(this.selectors.cartItemCount)) {
      const countText = await this.getElementText(this.selectors.cartItemCount);
      return parseInt(countText) || 0;
    }
    
    // Fallback: count cart items
    return await this.getElementCount(this.selectors.cartItems);
  }

  /**
   * Get badge count on cart icon
   * @returns {Promise<number>} Number displayed on badge
   */
  async getCartBadgeCount() {
    if (await this.isElementVisible(this.selectors.cartBadge)) {
      const badgeText = await this.getElementText(this.selectors.cartBadge);
      return parseInt(badgeText) || 0;
    }
    return 0;
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>} True if cart is empty
   */
  async isCartEmpty() {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0 || await this.isElementVisible(this.selectors.emptyCartMessage);
  }

  /**
   * Get list of items in cart
   * @returns {Promise<Array>} List of items with detailed information
   */
  async getCartItems() {
    const items = [];
    const cartItemElements = await this.page.locator(this.selectors.cartItems).all();
    
    for (let i = 0; i < cartItemElements.length; i++) {
      const item = cartItemElements[i];
      
      const name = await this.getItemText(item, this.selectors.cartItemName);
      const price = await this.getItemText(item, this.selectors.cartItemPrice);
      const quantity = await this.getItemText(item, this.selectors.cartItemQuantity);
      const total = await this.getItemText(item, this.selectors.cartItemTotal);
      
      items.push({
        index: i,
        name: name.trim(),
        price: this.parsePrice(price),
        quantity: parseInt(quantity) || 1,
        total: this.parsePrice(total)
      });
    }
    
    return items;
  }

  /**
   * Helper method to get text from sub-element
   * @param {*} parentElement - Parent element
   * @param {string} selector - Sub-element selector
   * @returns {Promise<string>} Text content
   */
  async getItemText(parentElement, selector) {
    try {
      const element = parentElement.locator(selector);
      if (await element.isVisible()) {
        return await element.textContent() || '';
      }
    } catch (error) {
      // Element does not exist
    }
    return '';
  }

  /**
   * Parse price string to number
   * @param {string} priceText - Text containing price
   * @returns {number} Numeric value
   */
  parsePrice(priceText) {
    if (!priceText) return 0;
    
    // Remove currency symbols and parse
    const cleanPrice = priceText.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 0;
  }

  /**
   * Increase quantity of item by index
   * @param {number} itemIndex - Index of item
   */
  async increaseQuantity(itemIndex) {
    const item = this.page.locator(this.selectors.cartItems).nth(itemIndex);
    const increaseBtn = item.locator(this.selectors.increaseQuantityBtn);
    
    if (await increaseBtn.isVisible()) {
      await increaseBtn.click();
    }
  }

  /**
   * Decrease quantity of item by index
   * @param {number} itemIndex - Index of item
   */
  async decreaseQuantity(itemIndex) {
    const item = this.page.locator(this.selectors.cartItems).nth(itemIndex);
    const decreaseBtn = item.locator(this.selectors.decreaseQuantityBtn);
    
    if (await decreaseBtn.isVisible()) {
      await decreaseBtn.click();
    }
  }

  /**
   * Remove item from cart by index
   * @param {number} itemIndex - Index of item
   */
  async removeItem(itemIndex) {
    const item = this.page.locator(this.selectors.cartItems).nth(itemIndex);
    const removeBtn = item.locator(this.selectors.removeItemBtn);
    
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
    }
  }

  /**
   * Remove item by product name
   * @param {string} itemName - Name of product to remove
   */
  async removeItemByName(itemName) {
    const items = await this.getCartItems();
    const itemIndex = items.findIndex(item => item.name.includes(itemName));
    
    if (itemIndex !== -1) {
      await this.removeItem(itemIndex);
    }
  }

  /**
   * Get total cart amount
   * @returns {Promise<number>} Total amount
   */
  async getCartTotal() {
    if (await this.isElementVisible(this.selectors.cartTotal)) {
      const totalText = await this.getElementText(this.selectors.cartTotal);
      return this.parsePrice(totalText);
    }
    return 0;
  }

  /**
   * Get subtotal (excluding tax, shipping)
   * @returns {Promise<number>} Subtotal
   */
  async getCartSubtotal() {
    if (await this.isElementVisible(this.selectors.cartSubtotal)) {
      const subtotalText = await this.getElementText(this.selectors.cartSubtotal);
      return this.parsePrice(subtotalText);
    }
    return 0;
  }

  /**
   * Get tax
   * @returns {Promise<number>} Tax amount
   */
  async getCartTax() {
    if (await this.isElementVisible(this.selectors.cartTax)) {
      const taxText = await this.getElementText(this.selectors.cartTax);
      return this.parsePrice(taxText);
    }
    return 0;
  }

  /**
   * Get shipping fee
   * @returns {Promise<number>} Shipping fee
   */
  async getCartShipping() {
    if (await this.isElementVisible(this.selectors.cartShipping)) {
      const shippingText = await this.getElementText(this.selectors.cartShipping);
      return this.parsePrice(shippingText);
    }
    return 0;
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    if (await this.isElementVisible(this.selectors.checkoutButton)) {
      await this.clickElement(this.selectors.checkoutButton);
    }
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    if (await this.isElementVisible(this.selectors.continueShoppingBtn)) {
      await this.clickElement(this.selectors.continueShoppingBtn);
    }
  }

  /**
   * Validate cart information
   * @returns {Promise<{isValid: boolean, errors: string[]}>}
   */
  async validateCart() {
    const errors = [];
    
    // Check if cart has items
    if (await this.isCartEmpty()) {
      errors.push('Cart is empty');
    }
    
    // Check if total amount is valid
    const total = await this.getCartTotal();
    if (total <= 0) {
      errors.push('Total amount is invalid');
    }
    
    // Check if each item has quantity > 0
    const items = await this.getCartItems();
    for (const item of items) {
      if (item.quantity <= 0) {
        errors.push(`Product quantity "${item.name}" is invalid`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get cart summary
   * @returns {Promise<Object>} Summary information
   */
  async getCartSummary() {
    return {
      itemCount: await this.getCartItemCount(),
      items: await this.getCartItems(),
      subtotal: await this.getCartSubtotal(),
      tax: await this.getCartTax(),
      shipping: await this.getCartShipping(),
      total: await this.getCartTotal(),
      isEmpty: await this.isCartEmpty()
    };
  }
}

module.exports = ShoppingCartComponent;
