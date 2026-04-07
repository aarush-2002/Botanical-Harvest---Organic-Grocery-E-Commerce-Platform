// ============================================
// SIMPLE CLIENT-SIDE ROUTER
// ============================================

const Router = {
    routes: {
        '/': 'index.html',
        '/products': 'products.html',
        '/cart': 'cart.html',
        '/checkout': 'checkout.html',
        '/login': 'login.html',
        '/signup': 'signup.html',
        '/dashboard': 'dashboard.html',
        '/orders': 'orders.html',
        '/admin': 'admin.html'
    },

    // Navigate to route
    navigate: function(path) {
        const page = this.routes[path];
        if (page) {
            window.location.href = page;
        } else {
            window.location.href = '404.html';
        }
    },

    // Get current route
    getCurrentRoute: function() {
        return window.location.pathname;
    },

    // Add route transition effect
    addTransition: function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.3s';
            document.body.style.opacity = '1';
        }, 100);
    }
};

// Add page transition on load
document.addEventListener('DOMContentLoaded', () => {
    Router.addTransition();
});