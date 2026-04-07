// ============================================
// CART MANAGEMENT MODULE
// ============================================

const CartManager = {
    // Add product to cart with options
    addProduct: function(product, quantity = 1) {
        const existingIndex = BotanicalApp.cart.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            // Product already in cart, update quantity
            BotanicalApp.cart[existingIndex].quantity += quantity;
        } else {
            // Add new product
            BotanicalApp.cart.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        BotanicalApp.saveCart();
        this.renderCart();
        return true;
    },

    // Remove product from cart
    removeProduct: function(productId) {
        BotanicalApp.cart = BotanicalApp.cart.filter(item => item.id !== productId);
        BotanicalApp.saveCart();
        this.renderCart();
    },

    // Update product quantity
    updateQuantity: function(productId, newQuantity) {
        const product = BotanicalApp.cart.find(item => item.id === productId);
        if (product) {
            if (newQuantity <= 0) {
                this.removeProduct(productId);
            } else {
                product.quantity = newQuantity;
                BotanicalApp.saveCart();
                this.renderCart();
            }
        }
    },

    // Calculate cart totals
    calculateTotals: function() {
        const subtotal = BotanicalApp.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        const deliveryFee = subtotal > 0 ? 40 : 0;
        const discount = subtotal > 200 ? 25 : 0;
        const total = subtotal + deliveryFee - discount;

        return {
            subtotal,
            deliveryFee,
            discount,
            total,
            itemCount: BotanicalApp.cart.reduce((sum, item) => sum + item.quantity, 0)
        };
    },

    // Render cart items
    renderCart: function() {
        const container = document.getElementById('cartItemsContainer');
        if (!container) return;

        if (BotanicalApp.cart.length === 0) {
            container.innerHTML = this.getEmptyCartHTML();
            this.hideCheckoutSection();
            return;
        }

        let html = '<div class="cart-items">';
        BotanicalApp.cart.forEach((item, index) => {
            html += this.getCartItemHTML(item, index);
        });
        html += '</div>';

        container.innerHTML = html;
        this.updateCartTotals();
        this.showCheckoutSection();
    },

    // Get cart item HTML
    getCartItemHTML: function(item, index) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ''}
                <div class="item-image-wrapper">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                </div>
                <div class="item-details">
                    <div class="item-header">
                        <div class="item-info">
                            <div class="item-category">${item.category || 'Product'}</div>
                            <div class="item-name">${item.name}</div>
                            <div class="item-weight">${item.weight || ''}</div>
                        </div>
                        <button class="delete-btn" onclick="CartManager.removeProduct('${item.id}')">
                            🗑️
                        </button>
                    </div>
                    <div class="item-footer">
                        <div class="item-price">₹${item.price.toFixed(2)}</div>
                        <div class="quantity-selector">
                            <button class="qty-btn" onclick="CartManager.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn" onclick="CartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Get empty cart HTML
    getEmptyCartHTML: function() {
        return `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3 class="empty-title">Your cart is empty</h3>
                <p class="empty-text">Start adding fresh organic produce to your cart</p>
                <button class="checkout-btn" onclick="window.location.href='products.html'" style="max-width: 300px; margin: 2rem auto 0;">
                    Browse Products
                </button>
            </div>
        `;
    },

    // Update cart totals display
    updateCartTotals: function() {
        const totals = this.calculateTotals();
        
        const elements = {
            itemTotal: document.getElementById('itemTotal'),
            deliveryFee: document.getElementById('deliveryFee'),
            discount: document.getElementById('discount'),
            totalAmount: document.getElementById('totalAmount')
        };

        if (elements.itemTotal) elements.itemTotal.textContent = `₹${totals.subtotal.toFixed(2)}`;
        if (elements.deliveryFee) elements.deliveryFee.textContent = `₹${totals.deliveryFee.toFixed(2)}`;
        if (elements.discount) elements.discount.textContent = `−₹${totals.discount.toFixed(2)}`;
        if (elements.totalAmount) elements.totalAmount.textContent = `₹${totals.total.toFixed(2)}`;
    },

    // Show checkout section
    showCheckoutSection: function() {
        const sections = ['addressSection', 'billSection', 'checkoutSection'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'block';
        });
    },

    // Hide checkout section
    hideCheckoutSection: function() {
        const sections = ['addressSection', 'billSection', 'checkoutSection'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    },

    // Apply coupon code
    applyCoupon: function(code) {
        const validCoupons = {
            'FIRST50': { type: 'percentage', value: 50, minOrder: 0 },
            'FRESH25': { type: 'percentage', value: 25, minOrder: 200 },
            'SAVE10': { type: 'fixed', value: 10, minOrder: 100 }
        };

        const coupon = validCoupons[code.toUpperCase()];
        if (!coupon) {
            BotanicalApp.showToast('Invalid coupon code', 'error');
            return false;
        }

        const totals = this.calculateTotals();
        if (totals.subtotal < coupon.minOrder) {
            BotanicalApp.showToast(`Minimum order ₹${coupon.minOrder} required`, 'warning');
            return false;
        }

        BotanicalApp.showToast('Coupon applied successfully! 🎉', 'success');
        return true;
    },

    // Proceed to checkout
    proceedToCheckout: function() {
        if (BotanicalApp.cart.length === 0) {
            BotanicalApp.showToast('Your cart is empty', 'warning');
            return;
        }

        // Check if user is logged in
        if (!BotanicalApp.user || !BotanicalApp.user.loggedIn) {
            if (confirm('Please login to continue checkout')) {
                window.location.href = 'login.html';
            }
            return;
        }

        window.location.href = 'checkout.html';
    }
};

// Initialize cart on cart page
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        CartManager.renderCart();
    });
}