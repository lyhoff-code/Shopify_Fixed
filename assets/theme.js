/**
 * NORDIC PURE ORGANIC
 * JavaScript Principal del Tema
 * Incluye: Animaciones, Chatbot IA, Efectos Modernos
 */

(function() {
  'use strict';

  // ==========================================================================
  // UTILIDADES
  // ==========================================================================

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // ==========================================================================
  // HEADER STICKY
  // ==========================================================================

  const initStickyHeader = () => {
    const header = document.querySelector('[data-header]');
    if (!header) return;

    const headerHeight = header.offsetHeight;
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > headerHeight) {
        header.classList.add('is-sticky');
      } else {
        header.classList.remove('is-sticky');
      }

      lastScroll = currentScroll;
    });
  };

  // ==========================================================================
  // CARRITO DRAWER
  // ==========================================================================

  const initCartDrawer = () => {
    const cartToggle = document.querySelector('[data-cart-toggle]');
    const cartDrawer = document.querySelector('[data-cart-drawer]');
    const cartOverlay = document.querySelector('[data-cart-overlay]');
    const cartClose = document.querySelector('[data-cart-close]');

    if (!cartToggle || !cartDrawer) return;

    const openCart = () => {
      cartDrawer.classList.add('is-open');
      if (cartOverlay) cartOverlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    };

    const closeCart = () => {
      cartDrawer.classList.remove('is-open');
      if (cartOverlay) cartOverlay.classList.remove('is-visible');
      document.body.style.overflow = '';
    };

    cartToggle.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cartDrawer.classList.contains('is-open')) {
        closeCart();
      }
    });
  };

  // ==========================================================================
  // SELECTOR DE CANTIDAD
  // ==========================================================================

  const initQuantitySelectors = () => {
    document.querySelectorAll('[data-quantity-minus]').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('[data-quantity-input]');
        if (input && parseInt(input.value) > 1) {
          input.value = parseInt(input.value) - 1;
        }
      });
    });

    document.querySelectorAll('[data-quantity-plus]').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('[data-quantity-input]');
        if (input) {
          input.value = parseInt(input.value) + 1;
        }
      });
    });
  };

  // ==========================================================================
  // GALERÍA DE PRODUCTO
  // ==========================================================================

  const initProductGallery = () => {
    const thumbs = document.querySelectorAll('[data-thumb-index]');
    const mainImage = document.querySelector('[data-product-main-image]');

    if (!thumbs.length || !mainImage) return;

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');

        const img = thumb.querySelector('img');
        if (img) {
          mainImage.src = img.src.replace(/width=\d+/, 'width=1200');
          mainImage.alt = img.alt;
        }
      });
    });
  };

  // ==========================================================================
  // VARIANTES DE PRODUCTO
  // ==========================================================================

  const initProductVariants = () => {
    document.querySelectorAll('.product-form__variant').forEach(variant => {
      variant.addEventListener('click', (e) => {
        e.preventDefault();
        const siblings = variant.parentElement.querySelectorAll('.product-form__variant');
        siblings.forEach(s => s.classList.remove('is-selected'));
        variant.classList.add('is-selected');
      });
    });
  };

  // ==========================================================================
  // MENÚ MÓVIL
  // ==========================================================================

  const initMobileMenu = () => {
    const toggle = document.querySelector('[data-mobile-menu-toggle]');
    const nav = document.querySelector('.header__nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      document.body.classList.toggle('menu-open');
    });
  };

  // ==========================================================================
  // BÚSQUEDA
  // ==========================================================================

  const initSearch = () => {
    const searchToggle = document.querySelector('[data-search-toggle]');
    if (!searchToggle) return;

    searchToggle.addEventListener('click', () => {
      window.location.href = '/search';
    });
  };

  // ==========================================================================
  // AGREGAR AL CARRITO (AJAX)
  // ==========================================================================

  const initAddToCart = () => {
    const forms = document.querySelectorAll('form[action="/cart/add"]');

    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';

        try {
          const formData = new FormData(form);

          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const cartResponse = await fetch('/cart.js');
            const cart = await cartResponse.json();

            const cartCount = document.querySelector('[data-cart-count]');
            if (cartCount) {
              cartCount.textContent = cart.item_count;
            }

            submitBtn.textContent = 'Added!';

            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }, 2000);
          } else {
            throw new Error('Error al agregar al carrito');
          }
        } catch (error) {
          console.error('Error:', error);
          submitBtn.textContent = 'Error';

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 2000);
        }
      });
    });
  };

  // ==========================================================================
  // ANIMACIONES AL SCROLL - MEJORADAS
  // ==========================================================================

  const initScrollAnimations = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // Animar hijos con delay escalonado
          const children = entry.target.querySelectorAll('.animate-child');
          children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
            child.classList.add('is-visible');
          });

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Elementos a animar
    const animatedElements = document.querySelectorAll(`
      .section-header,
      .product-card,
      .collection-card,
      .testimonial-card,
      .trust-badge,
      .image-text__media,
      .image-text__content,
      .animate-on-scroll,
      .stagger-children
    `);

    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      observer.observe(el);
    });

    // Estilos para estado visible
    const style = document.createElement('style');
    style.textContent = `
      .is-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  };

  // ==========================================================================
  // ORDENACIÓN DE COLECCIÓN
  // ==========================================================================

  const initCollectionSort = () => {
    const sortSelect = document.querySelector('[data-sort-select]');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', sortSelect.value);
      window.location.href = url.toString();
    });

    const urlParams = new URLSearchParams(window.location.search);
    const currentSort = urlParams.get('sort_by');
    if (currentSort) {
      sortSelect.value = currentSort;
    }
  };

  // ==========================================================================
  // CHATBOT INTELIGENTE - NORDIC PURE AI
  // ==========================================================================

  const initChatbot = () => {
    // Chatbot knowledge base
    const botKnowledge = {
      greeting: [
        "Hi there! 👋 I'm your Nordic Pure assistant. How can I help you today?",
        "Welcome! I'm here to help you find the perfect products for your skin."
      ],
      products: {
        keywords: ['product', 'cream', 'serum', 'oil', 'cleanser', 'moisturizer', 'anti-aging', 'wrinkle'],
        responses: [
          "We have a complete line of certified organic products. Is there a specific category you're interested in? 🌿\n\n• Facial Care\n• Serums & Treatments\n• Body & Hydration\n• Anti-Aging",
          "All our products are formulated with 100% natural ingredients. Are you looking for something for a specific skin type?"
        ]
      },
      ingredients: {
        keywords: ['ingredient', 'natural', 'organic', 'chemical', 'paraben', 'sulfate', 'vegan'],
        responses: [
          "We're proud to use only natural and certified organic ingredients. Our formulas are:\n\n✓ Paraben-free\n✓ Sulfate-free\n✓ No synthetic fragrances\n✓ Cruelty-free and vegan",
          "Every ingredient has a specific purpose and is backed by scientific research. Would you like to know more about any particular ingredient?"
        ]
      },
      shipping: {
        keywords: ['shipping', 'delivery', 'arrive', 'time', 'cost', 'free', 'express'],
        responses: [
          "📦 Shipping Information:\n\n• FREE shipping on orders over $99\n• Express shipping: 1-2 business days\n• Standard shipping: 3-5 business days\n• Sustainable and discreet packaging",
          "We offer free shipping on orders over $99! Delivery time is 2-5 business days depending on your location."
        ]
      },
      returns: {
        keywords: ['return', 'refund', 'guarantee', 'exchange', 'money back'],
        responses: [
          "We have a 30-day satisfaction guarantee. If you're not 100% satisfied with your purchase, we'll give you a full refund, no questions asked. 💚",
          "Your satisfaction is our priority. We offer:\n\n• 30-day returns\n• Full refund\n• Simple and fast process"
        ]
      },
      skintype: {
        keywords: ['skin', 'dry', 'oily', 'combination', 'sensitive', 'normal', 'acne', 'spots', 'blemish'],
        responses: [
          "To recommend the best products, tell me: How would you describe your skin type?\n\n• Dry\n• Oily\n• Combination\n• Sensitive",
          "We have specific lines for each skin type. If you have sensitive skin, I'd recommend our calming line with centella asiatica and colloidal oatmeal."
        ]
      },
      order: {
        keywords: ['order', 'purchase', 'track', 'tracking', 'status'],
        responses: [
          "To check your order status, you'll need your order number. You can find it in the confirmation email we sent you. You can also check your order history in 'My Account'.",
          "Having an issue with your order? Send us an email at support@nordicpure.com with your order number and we'll help you right away."
        ]
      },
      contact: {
        keywords: ['contact', 'email', 'phone', 'whatsapp', 'talk', 'human', 'person', 'help'],
        responses: [
          "You can reach us at:\n\n📧 Email: hello@nordicpure.com\n📱 Phone: +1 (555) 123-4567\n⏰ Hours: Mon-Fri 9am-6pm EST\n\nIs there anything else I can help you with?"
        ]
      },
      thanks: {
        keywords: ['thanks', 'thank you', 'perfect', 'great', 'excellent', 'ok', 'good', 'awesome'],
        responses: [
          "You're welcome! 😊 If you have more questions, I'm here. Have a beautiful day!",
          "Happy to help! Don't hesitate to write if you need anything else. 💚"
        ]
      },
      default: [
        "Hmm, I'm not quite sure I understand. Could you rephrase your question? You can also ask me about:\n\n• Products and recommendations\n• Ingredients\n• Shipping and returns\n• Your skin type",
        "Sorry, I couldn't find specific information about that. Would you like me to connect you with a human advisor?"
      ]
    };

    // Obtener respuesta basada en el mensaje
    const getResponse = (message) => {
      const lowerMessage = message.toLowerCase();

      // Buscar coincidencia en la base de conocimiento
      for (const [category, data] of Object.entries(botKnowledge)) {
        if (category === 'greeting' || category === 'default') continue;

        if (data.keywords && data.keywords.some(keyword => lowerMessage.includes(keyword))) {
          return data.responses[Math.floor(Math.random() * data.responses.length)];
        }
      }

      return botKnowledge.default[Math.floor(Math.random() * botKnowledge.default.length)];
    };

    // Crear estructura HTML del chatbot
    const createChatbotHTML = () => {
      const chatbotHTML = `
        <!-- Botón del Chatbot -->
        <button class="chatbot-trigger" id="chatbot-trigger" aria-label="Abrir chat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        <!-- Ventana del Chatbot -->
        <div class="chatbot-window" id="chatbot-window">
          <div class="chatbot-header">
            <div class="chatbot-header-content">
              <div class="chatbot-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                  <path d="M12 6a3.5 3.5 0 0 0-3.5 3.5 1 1 0 0 0 2 0A1.5 1.5 0 1 1 12 11a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-1.16A3.49 3.49 0 0 0 12 6z"></path>
                  <circle cx="12" cy="17" r="1"></circle>
                </svg>
              </div>
              <div class="chatbot-info">
                <h3>Nordic Pure AI</h3>
                <p>Always available</p>
              </div>
            </div>
            <button class="chatbot-close" id="chatbot-close" aria-label="Cerrar chat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="chatbot-messages" id="chatbot-messages">
            <!-- Mensajes aparecerán aquí -->
          </div>

          <div class="chatbot-input">
            <div class="chatbot-input-wrapper">
              <input type="text" id="chatbot-input" placeholder="Type your message..." autocomplete="off">
              <button class="chatbot-send" id="chatbot-send" aria-label="Enviar mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>

          <div class="chatbot-powered">
            Powered by Nordic Pure AI
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    };

    // Agregar mensaje al chat
    const addMessage = (text, isUser = false, withQuickReplies = false) => {
      const messagesContainer = document.getElementById('chatbot-messages');
      const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      const messageHTML = `
        <div class="chat-message chat-message--${isUser ? 'user' : 'bot'}">
          <div class="chat-message__avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${isUser
                ? '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>'
                : '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>'
              }
            </svg>
          </div>
          <div class="chat-message__content">
            <p class="chat-message__text">${text.replace(/\n/g, '<br>')}</p>
            <span class="chat-message__time">${time}</span>
            ${withQuickReplies ? `
              <div class="chat-quick-replies">
                <button class="chat-quick-reply" data-message="What products do you have?">Products</button>
                <button class="chat-quick-reply" data-message="How does shipping work?">Shipping</button>
                <button class="chat-quick-reply" data-message="I have sensitive skin">My Skin</button>
                <button class="chat-quick-reply" data-message="How can I contact you?">Contact</button>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Event listeners para quick replies
      if (withQuickReplies) {
        document.querySelectorAll('.chat-quick-reply').forEach(btn => {
          btn.addEventListener('click', () => {
            const message = btn.getAttribute('data-message');
            handleUserMessage(message);
          });
        });
      }
    };

    // Mostrar indicador de escritura
    const showTyping = () => {
      const messagesContainer = document.getElementById('chatbot-messages');
      const typingHTML = `
        <div class="chat-message chat-message--bot" id="typing-indicator">
          <div class="chat-message__avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
      messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Ocultar indicador de escritura
    const hideTyping = () => {
      const typing = document.getElementById('typing-indicator');
      if (typing) typing.remove();
    };

    // Manejar mensaje del usuario
    const handleUserMessage = (message) => {
      if (!message.trim()) return;

      // Agregar mensaje del usuario
      addMessage(message, true);

      // Mostrar typing
      showTyping();

      // Simular delay de respuesta
      setTimeout(() => {
        hideTyping();
        const response = getResponse(message);
        addMessage(response, false);
      }, 1000 + Math.random() * 1000);
    };

    // Inicializar eventos del chatbot
    const initChatbotEvents = () => {
      const trigger = document.getElementById('chatbot-trigger');
      const chatWindow = document.getElementById('chatbot-window');
      const closeBtn = document.getElementById('chatbot-close');
      const input = document.getElementById('chatbot-input');
      const sendBtn = document.getElementById('chatbot-send');

      let isFirstOpen = true;

      // Abrir/cerrar chatbot
      trigger.addEventListener('click', () => {
        chatWindow.classList.toggle('is-open');
        trigger.classList.toggle('is-open');

        if (isFirstOpen && chatWindow.classList.contains('is-open')) {
          setTimeout(() => {
            const greeting = botKnowledge.greeting[Math.floor(Math.random() * botKnowledge.greeting.length)];
            addMessage(greeting, false, true);
          }, 500);
          isFirstOpen = false;
        }
      });

      closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('is-open');
        trigger.classList.remove('is-open');
      });

      // Enviar mensaje
      const sendMessage = () => {
        const message = input.value.trim();
        if (message) {
          handleUserMessage(message);
          input.value = '';
        }
      };

      sendBtn.addEventListener('click', sendMessage);

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });

      // Cerrar con ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatWindow.classList.contains('is-open')) {
          chatWindow.classList.remove('is-open');
          trigger.classList.remove('is-open');
        }
      });
    };

    // Crear e inicializar
    createChatbotHTML();
    initChatbotEvents();
  };

  // ==========================================================================
  // SMOOTH SCROLL
  // ==========================================================================

  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  // ==========================================================================
  // PARALLAX EFFECT (Suave)
  // ==========================================================================

  const initParallax = () => {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    if (!parallaxElements.length) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(el => {
        const speed = 0.3;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  };

  // ==========================================================================
  // INICIALIZACIÓN
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initCartDrawer();
    initQuantitySelectors();
    initProductGallery();
    initProductVariants();
    initMobileMenu();
    initSearch();
    initAddToCart();
    initScrollAnimations();
    initCollectionSort();
    initChatbot();
    initSmoothScroll();
    initParallax();

    // Page loaded animation
    document.body.classList.add('is-loaded');
  });

})();
