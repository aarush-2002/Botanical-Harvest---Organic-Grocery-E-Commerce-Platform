// ============================================
// BOTANICAL HARVEST - MAIN APPLICATION
// Portfolio Demo E-Commerce Platform
// ============================================

// Global State Management
const BotanicalApp = {
    user: null,
    cart: [],
    products: [],
    orders: [],
    
    // Initialize the application
    init: function() {
        console.log('🌿 Botanical Harvest Initialized');
        this.loadUser();
        this.loadCart();
        this.initializeRouting();
        this.setupEventListeners();
        this.checkAuthStatus();
    },

    // Load user from localStorage
    loadUser: function() {
        const userData = localStorage.getItem('botanicalUser');
        if (userData) {
            this.user = JSON.parse(userData);
            this.updateUIForUser();
        }
    },

    // Update UI when user is logged in
    updateUIForUser: function() {
        const userNameElements = document.querySelectorAll('[data-user-name]');
        const loginButtons = document.querySelectorAll('[data-login-btn]');
        const userButtons = document.querySelectorAll('[data-user-btn]');

        if (this.user && this.user.loggedIn) {
            userNameElements.forEach(el => {
                el.textContent = this.user.name || 'User';
            });
            loginButtons.forEach(el => el.style.display = 'none');
            userButtons.forEach(el => el.style.display = 'block');
        }
    },

    // Check if user should be on protected page
    checkAuthStatus: function() {
        const protectedPages = ['dashboard.html', 'orders.html', 'admin.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            if (!this.user || !this.user.loggedIn) {
                window.location.href = 'login.html';
            }
        }
    },

    // Load cart from localStorage
    loadCart: function() {
        const cartData = localStorage.getItem('botanicalCart');
        if (cartData) {
            this.cart = JSON.parse(cartData);
            this.updateCartBadge();
        }
    },

    // Update cart badge count
    updateCartBadge: function() {
        const badges = document.querySelectorAll('[data-cart-count]');
        const count = this.cart.length;
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    // Save cart to localStorage
    saveCart: function() {
        localStorage.setItem('botanicalCart', JSON.stringify(this.cart));
        this.updateCartBadge();
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Handle "Add to Cart" buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-add-to-cart]')) {
                const productId = e.target.dataset.addToCart;
                this.addToCart(productId);
            }

            // Handle logout
            if (e.target.matches('[data-logout]')) {
                this.logout();
            }
        });

        // Handle search
        const searchInputs = document.querySelectorAll('[data-search-input]');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        });
    },

    // Add product to cart
    addToCart: function(productId) {
        // In real app, fetch product from database
        const product = {
            id: productId,
            name: 'Product ' + productId,
            price: Math.floor(Math.random() * 200) + 50,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200'
        };

        this.cart.push(product);
        this.saveCart();
        this.showToast('Added to cart! 🌿', 'success');
        
        // Animate button
        const button = document.querySelector(`[data-add-to-cart="${productId}"]`);
        if (button) {
            button.classList.add('animate-bounce');
            setTimeout(() => {
                button.classList.remove('animate-bounce');
            }, 600);
        }
    },

    // Remove from cart
    removeFromCart: function(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.showToast('Item removed', 'info');
    },

    // Update quantity
    updateQuantity: function(index, change) {
        if (this.cart[index]) {
            this.cart[index].quantity += change;
            if (this.cart[index].quantity <= 0) {
                this.removeFromCart(index);
            } else {
                this.saveCart();
            }
        }
    },

    // Clear cart
    clearCart: function() {
        this.cart = [];
        this.saveCart();
    },

    // Get cart total
    getCartTotal: function() {
        return this.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    },

    // Handle search
    handleSearch: function(query) {
        console.log('Searching for:', query);
        // In real app, filter products
    },

    // Show toast notification
    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${this.getToastIcon(type)}</div>
            <div class="toast-message">${message}</div>
        `;
        
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 1rem;';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        // Add styles
        toast.style.cssText = `
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            display: flex;
            gap: 0.75rem;
            align-items: center;
            min-width: 280px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Get toast icon
    getToastIcon: function(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    },

    // Logout user
    logout: function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('botanicalUser');
            this.user = null;
            window.location.href = 'login.html';
        }
    },

    // Initialize routing (simple client-side routing)
    initializeRouting: function() {
        // Handle back/forward buttons
        window.addEventListener('popstate', (e) => {
            console.log('Navigation:', e.state);
        });
    },

    // Format currency
    formatCurrency: function(amount) {
        return '₹' + amount.toFixed(2);
    },

    // Format date
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone
    validatePhone: function(phone) {
        const re = /^[6-9]\d{9}$/;
        return re.test(phone);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    BotanicalApp.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BotanicalApp;
}