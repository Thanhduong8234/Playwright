const BasePage = require('../pages/BasePage');

/**
 * SHOPPING CART COMPONENT
 * Component tái sử dụng cho giỏ hàng
 */
class ShoppingCartComponent extends BasePage {
  constructor(page) {
    super(page);
    
    // Định nghĩa các selectors cho shopping cart
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
   * Mở giỏ hàng
   */
  async openCart() {
    if (await this.isElementVisible(this.selectors.cartIcon)) {
      await this.clickElement(this.selectors.cartIcon);
    }
  }

  /**
   * Đóng giỏ hàng
   */
  async closeCart() {
    // Có thể click outside hoặc button close tùy implementation
    await this.page.keyboard.press('Escape');
  }

  /**
   * Lấy số lượng items trong giỏ hàng
   * @returns {Promise<number>} Số lượng items
   */
  async getCartItemCount() {
    if (await this.isElementVisible(this.selectors.cartItemCount)) {
      const countText = await this.getElementText(this.selectors.cartItemCount);
      return parseInt(countText) || 0;
    }
    
    // Fallback: đếm số cart items
    return await this.getElementCount(this.selectors.cartItems);
  }

  /**
   * Lấy badge count trên cart icon
   * @returns {Promise<number>} Số hiển thị trên badge
   */
  async getCartBadgeCount() {
    if (await this.isElementVisible(this.selectors.cartBadge)) {
      const badgeText = await this.getElementText(this.selectors.cartBadge);
      return parseInt(badgeText) || 0;
    }
    return 0;
  }

  /**
   * Kiểm tra giỏ hàng có rỗng không
   * @returns {Promise<boolean>} True nếu giỏ hàng rỗng
   */
  async isCartEmpty() {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0 || await this.isElementVisible(this.selectors.emptyCartMessage);
  }

  /**
   * Lấy danh sách items trong giỏ hàng
   * @returns {Promise<Array>} Danh sách items với thông tin chi tiết
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
   * Helper method để lấy text từ sub-element
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
      // Element không tồn tại
    }
    return '';
  }

  /**
   * Parse price string thành number
   * @param {string} priceText - Text chứa giá
   * @returns {number} Giá trị số
   */
  parsePrice(priceText) {
    if (!priceText) return 0;
    
    // Remove currency symbols và parse
    const cleanPrice = priceText.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 0;
  }

  /**
   * Tăng số lượng item theo index
   * @param {number} itemIndex - Index của item
   */
  async increaseQuantity(itemIndex) {
    const item = this.page.locator(this.selectors.cartItems).nth(itemIndex);
    const increaseBtn = item.locator(this.selectors.increaseQuantityBtn);
    
    if (await increaseBtn.isVisible()) {
      await increaseBtn.click();
    }
  }

  /**
   * Giảm số lượng item theo index
   * @param {number} itemIndex - Index của item
   */
  async decreaseQuantity(itemIndex) {
    const item = this.page.locator(this.selectors.cartItems).nth(itemIndex);
    const decreaseBtn = item.locator(this.selectors.decreaseQuantityBtn);
    
    if (await decreaseBtn.isVisible()) {
      await decreaseBtn.click();
    }
  }

  /**
   * Xóa item khỏi giỏ hàng theo index
   * @param {number} itemIndex - Index của item
   */
  async removeItem(itemIndex) {
    const item = this.page.locator(this.selectors.cartItems).nth(itemIndex);
    const removeBtn = item.locator(this.selectors.removeItemBtn);
    
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
    }
  }

  /**
   * Xóa item theo tên sản phẩm
   * @param {string} itemName - Tên sản phẩm cần xóa
   */
  async removeItemByName(itemName) {
    const items = await this.getCartItems();
    const itemIndex = items.findIndex(item => item.name.includes(itemName));
    
    if (itemIndex !== -1) {
      await this.removeItem(itemIndex);
    }
  }

  /**
   * Lấy tổng tiền giỏ hàng
   * @returns {Promise<number>} Tổng tiền
   */
  async getCartTotal() {
    if (await this.isElementVisible(this.selectors.cartTotal)) {
      const totalText = await this.getElementText(this.selectors.cartTotal);
      return this.parsePrice(totalText);
    }
    return 0;
  }

  /**
   * Lấy subtotal (tổng tiền chưa bao gồm thuế, phí ship)
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
   * Lấy thuế
   * @returns {Promise<number>} Số tiền thuế
   */
  async getCartTax() {
    if (await this.isElementVisible(this.selectors.cartTax)) {
      const taxText = await this.getElementText(this.selectors.cartTax);
      return this.parsePrice(taxText);
    }
    return 0;
  }

  /**
   * Lấy phí vận chuyển
   * @returns {Promise<number>} Phí vận chuyển
   */
  async getCartShipping() {
    if (await this.isElementVisible(this.selectors.cartShipping)) {
      const shippingText = await this.getElementText(this.selectors.cartShipping);
      return this.parsePrice(shippingText);
    }
    return 0;
  }

  /**
   * Tiến hành checkout
   */
  async proceedToCheckout() {
    if (await this.isElementVisible(this.selectors.checkoutButton)) {
      await this.clickElement(this.selectors.checkoutButton);
    }
  }

  /**
   * Tiếp tục mua sắm
   */
  async continueShopping() {
    if (await this.isElementVisible(this.selectors.continueShoppingBtn)) {
      await this.clickElement(this.selectors.continueShoppingBtn);
    }
  }

  /**
   * Validate thông tin giỏ hàng
   * @returns {Promise<{isValid: boolean, errors: string[]}>}
   */
  async validateCart() {
    const errors = [];
    
    // Kiểm tra giỏ hàng có items không
    if (await this.isCartEmpty()) {
      errors.push('Giỏ hàng trống');
    }
    
    // Kiểm tra tổng tiền hợp lệ
    const total = await this.getCartTotal();
    if (total <= 0) {
      errors.push('Tổng tiền không hợp lệ');
    }
    
    // Kiểm tra từng item có quantity > 0
    const items = await this.getCartItems();
    for (const item of items) {
      if (item.quantity <= 0) {
        errors.push(`Số lượng sản phẩm "${item.name}" không hợp lệ`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Lấy tóm tắt giỏ hàng
   * @returns {Promise<Object>} Thông tin tóm tắt
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
