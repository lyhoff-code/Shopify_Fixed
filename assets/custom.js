/**
 * NORDIC PURE ORGANIC - Custom JavaScript
 * Enhanced functionality for modern store experience
 */

(function() {
  'use strict';

  // ==========================================================================
  // WELCOME POPUP
  // ==========================================================================

  const initWelcomePopup = () => {
    const popup = document.getElementById('welcome-popup');
    if (!popup) return;

    const hasSeenPopup = localStorage.getItem('nordicpure_popup_seen');
    const closeButtons = popup.querySelectorAll('[data-popup-close]');
    const form = document.getElementById('popup-form');

    // Show popup after 3 seconds if not seen
    if (!hasSeenPopup) {
      setTimeout(() => {
        popup.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }, 3000);
    }

    // Close popup handlers
    const closePopup = () => {
      popup.classList.remove('is-open');
      document.body.style.overflow = '';
      localStorage.setItem('nordicpure_popup_seen', 'true');
    };

    closeButtons.forEach(btn => {
      btn.addEventListener('click', closePopup);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('is-open')) {
        closePopup();
      }
    });

    // Form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;

        // Here you would typically send to your email service
        console.log('Newsletter signup:', email);

        // Show success message
        const textContainer = popup.querySelector('.welcome-popup__text');
        textContainer.innerHTML = `
          <div style="text-align: center;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" stroke-width="2" style="margin-bottom: 20px;">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2 style="margin-bottom: 16px;">You're In!</h2>
            <p style="color: var(--color-text-light); margin-bottom: 24px;">Check your email for your 15% off code.<br>Use code: <strong>WELCOME15</strong></p>
            <button class="btn btn--primary" data-popup-close>Start Shopping</button>
          </div>
        `;

        // Re-attach close handler
        textContainer.querySelector('[data-popup-close]').addEventListener('click', closePopup);

        // Close after delay
        setTimeout(closePopup, 5000);
      });
    }
  };

  // ==========================================================================
  // COUNTDOWN TIMER
  // ==========================================================================

  const initCountdownTimers = () => {
    const timers = document.querySelectorAll('[data-countdown]');

    timers.forEach(timer => {
      const endDateStr = timer.getAttribute('data-end-date');
      let endDate;

      if (endDateStr === 'tomorrow') {
        endDate = new Date();
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(23, 59, 59, 999);
      } else {
        endDate = new Date(endDateStr);
      }

      const daysEl = timer.querySelector('[data-days]');
      const hoursEl = timer.querySelector('[data-hours]');
      const minutesEl = timer.querySelector('[data-minutes]');
      const secondsEl = timer.querySelector('[data-seconds]');

      const updateTimer = () => {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;

        if (distance < 0) {
          timer.innerHTML = '<p style="text-align: center; color: var(--color-text-light);">Offer has ended</p>';
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
      };

      updateTimer();
      setInterval(updateTimer, 1000);
    });
  };

  // ==========================================================================
  // ANIMATED COUNTERS
  // ==========================================================================

  const initAnimatedCounters = () => {
    const counters = document.querySelectorAll('[data-count-to]');

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count-to'));
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  };

  // ==========================================================================
  // PRODUCT IMAGE HOVER (Second Image)
  // ==========================================================================

  const initProductImageHover = () => {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
      const primaryImage = card.querySelector('.product-card__image--primary');
      const secondaryImage = card.querySelector('.product-card__image--secondary');

      if (primaryImage && secondaryImage) {
        // Preload secondary image
        const img = new Image();
        img.src = secondaryImage.src;
      }
    });
  };

  // ==========================================================================
  // INGREDIENT PERCENTAGE ANIMATION
  // ==========================================================================

  const initIngredientBars = () => {
    const bars = document.querySelectorAll('.ingredient-card__percentage-fill');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.style.width;
          entry.target.style.width = '0%';
          setTimeout(() => {
            entry.target.style.width = width;
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
  };

  // ==========================================================================
  // EXIT INTENT POPUP
  // ==========================================================================

  const initExitIntent = () => {
    const popup = document.getElementById('welcome-popup');
    if (!popup) return;

    const hasSeenPopup = localStorage.getItem('nordicpure_popup_seen');
    if (hasSeenPopup) return;

    let shown = false;

    document.addEventListener('mouseout', (e) => {
      if (shown) return;

      // Check if leaving from top of page
      if (e.clientY < 10 && e.relatedTarget === null) {
        popup.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        shown = true;
      }
    });
  };

  // ==========================================================================
  // SMOOTH REVEAL ON SCROLL (Enhanced)
  // ==========================================================================

  const initEnhancedScrollReveal = () => {
    const elements = document.querySelectorAll(`
      .ingredient-card,
      .featured-in__logo,
      .stat-item
    `);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '-50px' });

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  };

  // ==========================================================================
  // MARQUEE TEXT ANIMATION
  // ==========================================================================

  const initMarquee = () => {
    const marquees = document.querySelectorAll('[data-marquee]');

    marquees.forEach(marquee => {
      const content = marquee.innerHTML;
      marquee.innerHTML = content + content + content;

      let position = 0;
      const speed = 1;

      const animate = () => {
        position -= speed;
        if (position <= -marquee.scrollWidth / 3) {
          position = 0;
        }
        marquee.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animate);
      };

      animate();
    });
  };

  // ==========================================================================
  // LAZY LOAD IMAGES
  // ==========================================================================

  const initLazyLoad = () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('is-loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));
  };

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================

  window.showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast__close">&times;</button>
    `;

    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: ${type === 'success' ? 'var(--color-secondary)' : 'var(--color-primary)'};
      color: #fff;
      padding: 16px 24px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 100000;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      transition: transform 0.4s ease;
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Close handler
    toast.querySelector('.toast__close').addEventListener('click', () => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => toast.remove(), 400);
    });

    // Auto close
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    initWelcomePopup();
    initCountdownTimers();
    initAnimatedCounters();
    initProductImageHover();
    initIngredientBars();
    initEnhancedScrollReveal();
    initLazyLoad();

    // Delay exit intent slightly
    setTimeout(initExitIntent, 5000);

    console.log('Nordic Pure Organic - Enhanced features loaded');
  });

})();
