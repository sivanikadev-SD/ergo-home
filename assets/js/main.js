/**
 * ErgoHome - Main JavaScript
 * Ergonomic Home Office Design Consultancy
 * Version: 1.0.0
 */

'use strict';

/* ==========================================================================
   1. Theme Manager (Dark / Light Mode)
   ========================================================================== */
const ThemeManager = {
  KEY: 'ergohome-theme',

  init() {
    const stored = localStorage.getItem(this.KEY);
    if (stored) {
      this.apply(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.apply('dark');
    } else {
      this.apply('light');
    }

    // Watch for OS preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.KEY)) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });

    // Handle toggle clicks
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-toggle');
      if (btn) {
        e.preventDefault();
        this.toggle();
      }
    });
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.KEY, theme);
    this.updateToggleButtons(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  },

  updateToggleButtons(theme) {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Light mode' : 'Dark mode');
    });
  }
};

/* ==========================================================================
   2. RTL Manager
   ========================================================================== */
const RTLManager = {
  KEY: 'ergohome-dir',

  init() {
    const stored = localStorage.getItem(this.KEY);
    if (stored) this.apply(stored);

    // Initial sync
    this.syncUI(stored || 'ltr');

    // Handle toggle clicks
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.rtl-toggle');
      if (btn) {
        e.preventDefault();
        this.toggle();
      }
    });
  },

  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem(this.KEY, dir);
    this.syncUI(dir);
  },

  toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    this.apply(current === 'rtl' ? 'ltr' : 'rtl');
  },

  syncUI(dir) {
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.classList.toggle('active', dir === 'rtl');
      const text = btn.querySelector('.rtl-toggle-text');
      if (text) text.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }
};

/* ==========================================================================
   3. Navigation
   ========================================================================== */
const Navigation = {
  nav: null,
  hamburger: null,
  mobileMenu: null,

  init() {
    this.nav = document.querySelector('.nav');
    this.hamburger = document.querySelector('.nav__hamburger');
    this.mobileMenu = document.querySelector('.nav__mobile');

    // Scroll behavior
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    this.handleScroll();

    // Hamburger toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobile());
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => this.closeMobile());
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.mobileMenu && this.mobileMenu.classList.contains('open')) {
        if (!this.nav.contains(e.target)) this.closeMobile();
      }
    });

    // Active link detection
    this.setActiveLink();
  },

  handleScroll() {
    if (!this.nav) return;
    if (window.scrollY > 20) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  },

  toggleMobile() {
    const isOpen = this.mobileMenu && this.mobileMenu.classList.contains('open');
    if (isOpen) this.closeMobile();
    else this.openMobile();
  },

  openMobile() {
    if (!this.hamburger || !this.mobileMenu) return;
    this.hamburger.classList.add('open');
    this.hamburger.setAttribute('aria-expanded', 'true');
    this.mobileMenu.classList.add('open');
    this.mobileMenu.style.display = 'block';
    document.body.style.overflow = 'hidden';
  },

  closeMobile() {
    if (!this.hamburger || !this.mobileMenu) return;
    this.hamburger.classList.remove('open');
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.mobileMenu.classList.remove('open');
    setTimeout(() => {
      if (!this.mobileMenu.classList.contains('open')) {
        this.mobileMenu.style.display = 'none';
      }
    }, 300);
    document.body.style.overflow = '';
  },

  setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === path || (path === '' && href === 'index.html') ||
          (href.includes(path) && path !== '')) {
        link.classList.add('active');
      }
    });
  }
};

/* ==========================================================================
   4. Scroll Reveal Animation
   ========================================================================== */
const ScrollReveal = {
  observer: null,

  init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      this.observer.observe(el);
    });
  }
};

/* ==========================================================================
   5. Counter Animation
   ========================================================================== */
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = performance.now();

    const step = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = target * eased;
      el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  }
};

/* ==========================================================================
   6. Accordion
   ========================================================================== */
const Accordion = {
  init() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('open');

        // Close all siblings (single open mode)
        const accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion-item.open').forEach(openItem => {
            if (openItem !== item) openItem.classList.remove('open');
          });
        }

        item.classList.toggle('open', !isOpen);
        header.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }
};

/* ==========================================================================
   7. Tabs
   ========================================================================== */
const Tabs = {
  init() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        const parent = btn.closest('[data-tabs]') || btn.closest('section') || document;

        parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = parent.querySelector(`[data-tab-panel="${tabId}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  }
};

/* ==========================================================================
   8. Form Validation
   ========================================================================== */
const FormValidator = {
  init() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });

      // Real-time validation
      form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) this.validateField(input);
        });
      });
    });
  },

  validateForm(form) {
    let valid = true;
    form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
      if (!this.validateField(input)) valid = false;
    });
    return valid;
  },

  validateField(input) {
    const group = input.closest('.form-group');
    const errorEl = group?.querySelector('.form-error');
    let error = '';

    // Required
    if (input.required && !input.value.trim()) {
      error = 'This field is required.';
    }
    // Email
    else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      error = 'Please enter a valid email address.';
    }
    // Phone
    else if (input.type === 'tel' && input.value && !/^[\d\s\+\-\(\)]{7,}$/.test(input.value)) {
      error = 'Please enter a valid phone number.';
    }
    // Min length
    else if (input.minLength && input.value.length < input.minLength && input.value.length > 0) {
      error = `Minimum ${input.minLength} characters required.`;
    }

    if (error) {
      input.classList.add('error');
      if (errorEl) { errorEl.innerHTML = `<i class="ri-error-warning-line"></i>${error}`; errorEl.style.display = 'flex'; }
      return false;
    } else {
      input.classList.remove('error');
      if (errorEl) { errorEl.style.display = 'none'; }
      return true;
    }
  }
};

/* ==========================================================================
   9. Toast Notifications
   ========================================================================== */
const Toast = {
  container: null,

  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.setAttribute('role', 'alert');
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 4000) {
    const icons = { success: 'ri-checkbox-circle-fill', error: 'ri-close-circle-fill', warning: 'ri-alert-fill', info: 'ri-information-fill' };
    const colors = { success: '#10b981', error: '#f43f5e', warning: '#f59e0b', info: '#0ea5e9' };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<i class="${icons[type] || icons.info}" style="color:${colors[type]};font-size:20px"></i><span>${message}</span><button onclick="this.parentElement.remove()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:16px;padding:2px"><i class="ri-close-line"></i></button>`;

    this.container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  }
};

/* ==========================================================================
   10. Smooth Scroll to Anchors
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const y = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   11. Lazy Load Images
   ========================================================================== */
function initLazyLoad() {
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          obs.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
  }
}

/* ==========================================================================
   12. Star Rating
   ========================================================================== */
function initStarRating() {
  document.querySelectorAll('.star-rating').forEach(widget => {
    const buttons = widget.querySelectorAll('button');
    let selected = 0;

    buttons.forEach((btn, i) => {
      btn.addEventListener('mouseenter', () => highlight(i));
      btn.addEventListener('mouseleave', () => highlight(selected - 1));
      btn.addEventListener('click', () => {
        selected = i + 1;
        widget.setAttribute('data-rating', selected);
        highlight(selected - 1);
      });
    });

    function highlight(index) {
      buttons.forEach((b, i) => b.classList.toggle('active', i <= index));
    }
  });
}

/* ==========================================================================
   13. Cookie Consent Banner
   ========================================================================== */
const CookieBanner = {
  KEY: 'ergohome-cookies',
  init() {
    if (localStorage.getItem(this.KEY)) return;
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.style.display = 'flex';
    banner.querySelector('.js-accept-cookies')?.addEventListener('click', () => {
      localStorage.setItem(this.KEY, 'accepted');
      banner.style.display = 'none';
    });
  }
};

/* ==========================================================================
   14. Testimonial Slider (simple auto-scroll)
   ========================================================================== */
const TestimonialSlider = {
  init() {
    const track = document.querySelector('.testimonial-track');
    if (!track) return;

    let pos = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length <= 3) return;

    const gap = 24;
    const cardWidth = cards[0].offsetWidth + gap;
    let paused = false;

    track.addEventListener('mouseenter', () => paused = true);
    track.addEventListener('mouseleave', () => paused = false);

    setInterval(() => {
      if (paused) return;
      pos += cardWidth;
      if (pos >= cardWidth * cards.length) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
    }, 3500);
  }
};

/* ==========================================================================
   15. Contact Form Submission (Async placeholder)
   ========================================================================== */
function initContactForms() {
  document.querySelectorAll('.js-contact-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!FormValidator.validateForm(form)) return;

      const btn = form.querySelector('[type="submit"]');
      const origText = btn.innerHTML;
      btn.classList.add('loading');
      btn.disabled = true;

      // Simulate async submission (replace with Formspree endpoint)
      await new Promise(r => setTimeout(r, 1800));

      btn.classList.remove('loading');
      btn.disabled = false;
      btn.innerHTML = origText;
      form.reset();
      Toast.show('Message sent successfully! We\'ll be in touch soon.', 'success');
    });
  });
}

/* ==========================================================================
   16. Newsletter Form
   ========================================================================== */
function initNewsletterForms() {
  document.querySelectorAll('.js-newsletter-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value) return;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        Toast.show('Please enter a valid email address.', 'error');
        return;
      }

      const btn = form.querySelector('button');
      btn.classList.add('loading');
      await new Promise(r => setTimeout(r, 1500));
      btn.classList.remove('loading');
      input.value = '';
      Toast.show('You\'re subscribed! Welcome to ErgoHome newsletters.', 'success');
    });
  });
}

/* ==========================================================================
   17. Back to Top
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ==========================================================================
   18. Preloader
   ========================================================================== */
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  preloader.style.opacity = '0';
  setTimeout(() => preloader.remove(), 400);
}

/* ==========================================================================
   19. Initialize All Modules
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Navigation.init();
  ScrollReveal.init();
  CounterAnimation.init();
  Accordion.init();
  Tabs.init();
  FormValidator.init();
  Toast.init();
  initSmoothScroll();
  initLazyLoad();
  initStarRating();
  CookieBanner.init();
  TestimonialSlider.init();
  initContactForms();
  initNewsletterForms();
  initBackToTop();
  hidePreloader();

  // Modules are initialized with their own event delegation

  // — Premium: Cursor spotlight effect
  const spotlight = document.createElement('div');
  spotlight.style.cssText = `
    position: fixed; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 65%);
    pointer-events: none; z-index: 0; transform: translate(-50%,-50%);
    transition: opacity 0.4s ease; opacity: 0;
  `;
  document.body.appendChild(spotlight);

  let cursorActive = false;
  document.addEventListener('mousemove', (e) => {
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top  = e.clientY + 'px';
    if (!cursorActive) {
      cursorActive = true;
      spotlight.style.opacity = '1';
    }
  });
  document.addEventListener('mouseleave', () => { spotlight.style.opacity = '0'; cursorActive = false; });

  // — Premium: Subtle card tilt on mouse move
  document.querySelectorAll('.card, .stat-item, .testimonial-card, .blog-card, .bento-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
      card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});

// Make Toast globally available
window.ErgoHome = {
  Toast,
  ThemeManager,
  RTLManager,
  handleLogout(loginUrl) {
    // Show toast
    const msg = 'You have been logged out successfully. Redirecting…';
    this.Toast.show(msg, 'success');

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = loginUrl;
    }, 2000);
  }
};
