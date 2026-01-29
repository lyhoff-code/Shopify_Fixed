/**
 * TIENDA PROFESIONAL SHOPIFY
 * JavaScript Principal del Tema
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

    // Cerrar con ESC
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
        // Remover clase activa de todos los thumbs
        thumbs.forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');

        // Cambiar imagen principal
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
      // Aquí puedes abrir un modal de búsqueda o redirigir
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
        submitBtn.textContent = 'Agregando...';

        try {
          const formData = new FormData(form);

          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            // Actualizar contador del carrito
            const cartResponse = await fetch('/cart.js');
            const cart = await cartResponse.json();

            const cartCount = document.querySelector('[data-cart-count]');
            if (cartCount) {
              cartCount.textContent = cart.item_count;
            }

            submitBtn.textContent = '¡Agregado!';

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
  // ANIMACIONES AL SCROLL
  // ==========================================================================

  const initScrollAnimations = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.section-header, .product-card, .collection-card, .testimonial-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Añadir estilos para el estado visible
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

    // Establecer valor actual
    const urlParams = new URLSearchParams(window.location.search);
    const currentSort = urlParams.get('sort_by');
    if (currentSort) {
      sortSelect.value = currentSort;
    }
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
  });

})();
