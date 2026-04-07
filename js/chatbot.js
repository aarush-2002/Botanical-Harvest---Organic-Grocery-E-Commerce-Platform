// ============================================
// AI CHATBOT ASSISTANT
// ============================================

const Chatbot = {
    isOpen: false,
    messages: [],
    
    // Initialize chatbot
    init: function() {
        this.createChatbotUI();
        this.setupEventListeners();
        this.addWelcomeMessage();
    },

    // Create chatbot UI
    createChatbotUI: function() {
        const chatbotHTML = `
            <div id="chatbot-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 10000;">
                <!-- Chatbot Toggle Button -->
                <button id="chatbot-toggle" style="
                    width: 65px;
                    height: 65px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #2D5F3F 0%, #1B4332 100%);
                    color: white;
                    font-size: 2rem;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(45, 95, 63, 0.3);
                    transition: all 0.3s;
                ">
                    💬
                </button>

                <!-- Chatbot Window -->
                <div id="chatbot-window" style="
                    display: none;
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 360px;
                    height: 500px;
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    overflow: hidden;
                    flex-direction: column;
                ">
                    <!-- Header -->
                    <div style="
                        background: linear-gradient(135deg, #2D5F3F 0%, #1B4332 100%);
                        color: white;
                        padding: 1.25rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div>
                            <div style="font-weight: 800; font-size: 1.1rem;">🌿 Harvest Assistant</div>
                            <div style="font-size: 0.85rem; opacity: 0.9;">Online • Ready to help</div>
                        </div>
                        <button id="chatbot-close" style="
                            background: none;
                            border: none;
                            color: white;
                            font-size: 1.5rem;
                            cursor: pointer;
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            transition: all 0.3s;
                        ">×</button>
                    </div>

                    <!-- Messages -->
                    <div id="chatbot-messages" style="
                        flex: 1;
                        overflow-y: auto;
                        padding: 1.25rem;
                        background: #F0F7F0;
                    "></div>

                    <!-- Input -->
                    <div style="
                        padding: 1rem;
                        border-top: 1px solid #D4E8D4;
                        background: white;
                    ">
                        <div style="display: flex; gap: 0.5rem;">
                            <input 
                                type="text" 
                                id="chatbot-input" 
                                placeholder="Ask me anything..."
                                style="
                                    flex: 1;
                                    padding: 0.75rem 1rem;
                                    border: 2px solid #D4E8D4;
                                    border-radius: 100px;
                                    font-size: 0.95rem;
                                    outline: none;
                                "
                            >
                            <button id="chatbot-send" style="
                                padding: 0.75rem 1.5rem;
                                background: #2D5F3F;
                                color: white;
                                border: none;
                                border-radius: 100px;
                                font-weight: 700;
                                cursor: pointer;
                                transition: all 0.3s;
                            ">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    },

    // Setup event listeners
    setupEventListeners: function() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const send = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.toggleChat());
        send.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Hover effects
        toggle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        toggle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    },

    // Toggle chat window
    toggleChat: function() {
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            window.style.display = 'flex';
            toggle.textContent = '✕';
        } else {
            window.style.display = 'none';
            toggle.textContent = '💬';
        }
    },

    // Add welcome message
    addWelcomeMessage: function() {
        this.addMessage('bot', "Hi! 👋 I'm your Botanical Harvest assistant. How can I help you today?");
        this.addQuickReplies([
            'Show me fresh vegetables',
            'Track my order',
            'What are today\'s deals?',
            'Help with payment'
        ]);
    },

    // Send user message
    sendMessage: function() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage('user', message);
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            this.generateResponse(message);
        }, 600);
    },

    // Add message to chat
    addMessage: function(sender, text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        
        const isBot = sender === 'bot';
        
        messageDiv.style.cssText = `
            margin-bottom: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 16px;
            max-width: 80%;
            ${isBot 
                ? 'background: white; margin-right: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);' 
                : 'background: linear-gradient(135deg, #2D5F3F, #1B4332); color: white; margin-left: auto;'}
            animation: fadeIn 0.3s ease-out;
        `;
        
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ sender, text, timestamp: new Date() });
    },

    // Add quick reply buttons
    addQuickReplies: function(replies) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const repliesDiv = document.createElement('div');
        
        repliesDiv.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
        `;
        
        replies.forEach(reply => {
            const btn = document.createElement('button');
            btn.textContent = reply;
            btn.style.cssText = `
                padding: 0.5rem 1rem;
                background: white;
                border: 2px solid #D4E8D4;
                border-radius: 100px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            `;
            
            btn.addEventListener('click', () => {
                document.getElementById('chatbot-input').value = reply;
                this.sendMessage();
            });
            
            btn.addEventListener('mouseenter', function() {
                this.style.background = '#E8F5E9';
                this.style.borderColor = '#2D5F3F';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.background = 'white';
                this.style.borderColor = '#D4E8D4';
            });
            
            repliesDiv.appendChild(btn);
        });
        
        messagesContainer.appendChild(repliesDiv);
    },

    // Generate AI response
    generateResponse: function(userMessage) {
        const lowerMsg = userMessage.toLowerCase();
        let response = '';
        
        // Simple pattern matching (in real app, use actual AI)
        if (lowerMsg.includes('vegetable') || lowerMsg.includes('fruit')) {
            response = "We have fresh organic vegetables and fruits! 🥬🍎 Our top picks today are: Strawberries (₹115), Spinach (₹58), and Avocado (₹120). Would you like to see the full catalog?";
        } else if (lowerMsg.includes('track') || lowerMsg.includes('order')) {
            response = "I can help you track your order! 📦 Please provide your order ID (e.g., #BH2024-0042) or visit your Orders page for tracking details.";
        } else if (lowerMsg.includes('deal') || lowerMsg.includes('offer') || lowerMsg.includes('discount')) {
            response = "Great news! 🎉 Today's deals: \n• 50% OFF on Strawberries\n• Buy 2 Get 1 FREE on Dairy products\n• Use code FRESH25 for 25% off on orders above ₹200";
        } else if (lowerMsg.includes('payment') || lowerMsg.includes('pay')) {
            response = "We accept multiple payment methods! 💳 \n• Credit/Debit Cards\n• UPI (GPay, PhonePe, Paytm)\n• Cash on Delivery\nAll transactions are 100% secure.";
        } else if (lowerMsg.includes('delivery') || lowerMsg.includes('shipping')) {
            response = "We offer FREE delivery on orders above ₹199! 🚚 Standard delivery takes 2-3 hours. Express delivery available in select areas (30 minutes).";
        } else if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
            response = "We have a 100% satisfaction guarantee! 🛡️ If you're not happy with your order, you can return it within 24 hours for a full refund. No questions asked!";
        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            response = "Hello! 👋 Welcome to Botanical Harvest. How can I assist you today?";
        } else if (lowerMsg.includes('thank')) {
            response = "You're welcome! 😊 Is there anything else I can help you with?";
        } else {
            response = "I'm here to help! You can ask me about:\n• Fresh products and deals\n• Order tracking\n• Payment methods\n• Delivery information\n• Returns and refunds\n\nWhat would you like to know?";
        }
        
        this.addMessage('bot', response);
    }
};

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Chatbot.init();
});