/**
 * script.js — Daphy_Designs Shared JavaScript
 * "Where Kenyan Elegance Meets Artistry"
 *
 * Sections:
 *  1.  Mobile Nav Toggle
 *  2.  Navbar Scroll Effect
 *  3.  Active Page Link
 *  4.  Gallery Filter
 *  5.  Gallery Lightbox
 *  6.  Booking Form Live Summary
 *  7.  Booking Success Modal
 *  8.  FAQ Accordion
 *  9.  Add to Cart
 * 10.  Cart Drawer Toggle
 * 11.  Newsletter Form
 * 12.  Back-to-Top Button
 * 13.  Smooth Scroll
 * 14.  Scroll Reveal (IntersectionObserver)
 * 15.  Payment Method Toggle
 * 16.  Mobile Booking Bar
 * 17.  Utility: showToast(message, duration)
 * 18.  Utility: formatCurrency(amount)
 */

/* ─────────────────────────────────────────────────────────────────
   UTILITIES  (declared first so every section below can use them)
───────────────────────────────────────────────────────────────── */

/**
 * 18. formatCurrency
 * Returns a KES-formatted string.
 * @param {number} amount
 * @returns {string}  e.g. "KES 3,500"
 */
function formatCurrency(amount) {
  return 'KES ' + Number(amount).toLocaleString('en-KE');
}

/**
 * 17. showToast
 * Creates a toast notification, animates it in/out, then removes it.
 * @param {string} message
 * @param {number} [duration=3000]
 */
function showToast(message, duration) {
  duration = duration || 3000;

  // Container (holds stacked toasts)
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    Object.assign(container.style, {
      position:   'fixed',
      bottom:     '32px',
      right:      '24px',
      zIndex:     '99999',
      display:    'flex',
      flexDirection: 'column',
      gap:        '10px',
      pointerEvents: 'none',
    });
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    background:   '#1E1E1E',
    color:        '#FFF9F5',
    padding:      '12px 20px',
    borderRadius: '999px',
    fontSize:     '0.875rem',
    fontFamily:   "'Poppins', sans-serif",
    boxShadow:    '0 4px 20px rgba(0,0,0,0.25)',
    opacity:      '0',
    transform:    'translateY(12px)',
    transition:   'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents: 'auto',
    borderLeft:   '4px solid #B76E79',
    maxWidth:     '320px',
    wordBreak:    'break-word',
  });

  container.appendChild(toast);

  // Trigger reflow for transition
  // eslint-disable-next-line no-unused-expressions
  toast.offsetHeight;

  toast.style.opacity   = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(function () {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 320);
  }, duration);
}


/* ─────────────────────────────────────────────────────────────────
   MAIN — wrapped in DOMContentLoaded
───────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* ═══════════════════════════════════════════════════════════════
     1. MOBILE NAV TOGGLE
  ═══════════════════════════════════════════════════════════════ */
  try {
    var hamburger  = document.querySelector('.hamburger');
    var navDrawer  = document.querySelector('.nav-drawer');
    var navOverlay = document.querySelector('.nav-overlay');
    var navLinks   = document.querySelectorAll('.nav-drawer a');

    if (hamburger && navDrawer) {

      /** Open / close the mobile nav */
      function toggleNav(forceClose) {
        var isOpen = navDrawer.classList.contains('open') || forceClose;
        if (isOpen) {
          navDrawer.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          if (navOverlay) navOverlay.classList.remove('active');
        } else {
          navDrawer.classList.add('open');
          hamburger.classList.add('active');
          hamburger.setAttribute('aria-expanded', 'true');
          document.body.style.overflow = 'hidden';
          if (navOverlay) navOverlay.classList.add('active');
        }
      }

      hamburger.addEventListener('click', function () { toggleNav(); });

      // Close on overlay click
      if (navOverlay) {
        navOverlay.addEventListener('click', function () { toggleNav(true); });
      }

      // Close on any nav link click
      navLinks.forEach(function (link) {
        link.addEventListener('click', function () { toggleNav(true); });
      });

      // Close on outside click (desktop accidental open)
      document.addEventListener('click', function (e) {
        if (
          navDrawer.classList.contains('open') &&
          !navDrawer.contains(e.target) &&
          !hamburger.contains(e.target)
        ) {
          toggleNav(true);
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
          toggleNav(true);
        }
      });
    }
  } catch (e) {
    console.warn('[DaphyDesigns] Mobile Nav Toggle:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     2. NAVBAR SCROLL EFFECT
  ═══════════════════════════════════════════════════════════════ */
  try {
    var navbar = document.querySelector('nav, .navbar, header.site-header');

    if (navbar) {
      function handleNavScroll() {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      window.addEventListener('scroll', handleNavScroll, { passive: true });
      handleNavScroll(); // run on load in case page is already scrolled
    }
  } catch (e) {
    console.warn('[DaphyDesigns] Navbar Scroll Effect:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     3. ACTIVE PAGE LINK
  ═══════════════════════════════════════════════════════════════ */
  try {
    var currentPath = window.location.pathname;
    // Normalise: strip trailing slash, get basename
    var currentFile = currentPath.split('/').pop() || 'index.html';

    var allNavAnchors = document.querySelectorAll('.nav-links a, .nav-drawer a');

    allNavAnchors.forEach(function (anchor) {
      var href     = anchor.getAttribute('href') || '';
      var hrefFile = href.split('/').pop().split('?')[0].split('#')[0];

      // Match filename; treat empty or '/' or 'index.html' as homepage
      var isCurrent =
        hrefFile === currentFile ||
        (hrefFile === '' && (currentFile === '' || currentFile === 'index.html')) ||
        (hrefFile === 'index.html' && currentFile === '');

      if (isCurrent) {
        anchor.classList.add('active');
        anchor.setAttribute('aria-current', 'page');
      } else {
        anchor.classList.remove('active');
        anchor.removeAttribute('aria-current');
      }
    });
  } catch (e) {
    console.warn('[DaphyDesigns] Active Page Link:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     4. GALLERY FILTER
  ═══════════════════════════════════════════════════════════════ */
  try {
    var filterBtns    = document.querySelectorAll('[data-filter]');
    var galleryItems  = document.querySelectorAll('[data-category]');

    if (filterBtns.length && galleryItems.length) {

      function applyFilter(filter) {
        galleryItems.forEach(function (item) {
          var match = filter === 'all' || item.dataset.category === filter;
          if (match) {
            item.classList.remove('hidden');
            // Small fade-in
            item.style.opacity   = '0';
            item.style.transform = 'translateY(8px)';
            // Stagger slightly based on index
            var idx = Array.from(galleryItems).filter(function (gi) {
              return !gi.classList.contains('hidden');
            }).indexOf(item);
            setTimeout(function () {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity    = '1';
              item.style.transform  = 'translateY(0)';
            }, Math.min(idx * 40, 300));
          } else {
            item.classList.add('hidden');
            item.style.opacity = '';
            item.style.transform = '';
            item.style.transition = '';
          }
        });
      }

      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          applyFilter(btn.dataset.filter);
        });
      });

      // Default: show all
      applyFilter('all');
    }
  } catch (e) {
    console.warn('[DaphyDesigns] Gallery Filter:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     5. GALLERY LIGHTBOX
  ═══════════════════════════════════════════════════════════════ */
  try {
    // Collect all gallery images
    var galleryImgEls = Array.from(
      document.querySelectorAll('.gallery-grid img, .gallery-item img, [data-category] img')
    );

    // Build or select lightbox modal
    var lightbox = document.getElementById('lightbox');
    if (!lightbox && galleryImgEls.length) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Image lightbox');
      lightbox.innerHTML = [
        '<div class="lightbox-overlay"></div>',
        '<div class="lightbox-content">',
        '  <button class="lightbox-close" aria-label="Close lightbox">&times;</button>',
        '  <button class="lightbox-prev" aria-label="Previous image">&#8249;</button>',
        '  <button class="lightbox-next" aria-label="Next image">&#8250;</button>',
        '  <img class="lightbox-img" src="" alt="">',
        '  <p class="lightbox-caption"></p>',
        '</div>',
      ].join('');
      document.body.appendChild(lightbox);

      // Inject minimal inline styles (CSS file handles final look)
      var lbStyle = document.createElement('style');
      lbStyle.textContent = [
        '#lightbox{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;}',
        '#lightbox.hidden{display:none;}',
        '#lightbox .lightbox-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.85);cursor:pointer;}',
        '#lightbox .lightbox-content{position:relative;z-index:1;max-width:90vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;gap:12px;}',
        '#lightbox .lightbox-img{max-width:90vw;max-height:80vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);}',
        '#lightbox .lightbox-caption{color:#FFF9F5;font-family:"Poppins",sans-serif;font-size:0.85rem;text-align:center;margin:0;}',
        '#lightbox .lightbox-close{position:absolute;top:-40px;right:0;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;line-height:1;}',
        '#lightbox .lightbox-prev,#lightbox .lightbox-next{position:fixed;top:50%;transform:translateY(-50%);background:rgba(183,110,121,0.8);border:none;color:#fff;font-size:2.5rem;width:48px;height:64px;cursor:pointer;border-radius:8px;z-index:2;}',
        '#lightbox .lightbox-prev{left:12px;}',
        '#lightbox .lightbox-next{right:12px;}',
      ].join('');
      document.head.appendChild(lbStyle);
    }

    if (lightbox && galleryImgEls.length) {
      var currentLightboxIdx = 0;

      // Build image data array
      var lightboxImages = galleryImgEls.map(function (img) {
        return { src: img.src, alt: img.alt || '' };
      });

      function openLightbox(idx) {
        currentLightboxIdx = (idx + lightboxImages.length) % lightboxImages.length;
        var data = lightboxImages[currentLightboxIdx];
        lightbox.querySelector('.lightbox-img').src     = data.src;
        lightbox.querySelector('.lightbox-img').alt     = data.alt;
        lightbox.querySelector('.lightbox-caption').textContent = data.alt;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }

      // Attach click to each gallery image
      galleryImgEls.forEach(function (img, idx) {
        img.style.cursor = 'zoom-in';
        var parent = img.closest('[data-category], .gallery-item');
        var trigger = parent || img;
        trigger.addEventListener('click', function (e) {
          // Don't open if user clicked a button link inside the card
          if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
          openLightbox(idx);
        });
      });

      // Controls
      var lbClose   = lightbox.querySelector('.lightbox-close');
      var lbOverlay = lightbox.querySelector('.lightbox-overlay');
      var lbPrev    = lightbox.querySelector('.lightbox-prev');
      var lbNext    = lightbox.querySelector('.lightbox-next');

      if (lbClose)   lbClose.addEventListener('click',   closeLightbox);
      if (lbOverlay) lbOverlay.addEventListener('click',  closeLightbox);
      if (lbPrev)    lbPrev.addEventListener('click', function () { openLightbox(currentLightboxIdx - 1); });
      if (lbNext)    lbNext.addEventListener('click', function () { openLightbox(currentLightboxIdx + 1); });

      document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   openLightbox(currentLightboxIdx - 1);
        if (e.key === 'ArrowRight')  openLightbox(currentLightboxIdx + 1);
      });

      // Start hidden
      lightbox.classList.add('hidden');
    }
  } catch (e) {
    console.warn('[DaphyDesigns] Gallery Lightbox:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     6. BOOKING FORM LIVE SUMMARY
  ═══════════════════════════════════════════════════════════════ */
  try {
    var serviceSelect  = document.getElementById('service');
    var dateInput      = document.getElementById('date');
    var timeInput      = document.getElementById('time');
    var locationSelect = document.getElementById('location');

    // Summary card display elements
    var summaryService  = document.getElementById('summary-service');
    var summaryPrice    = document.getElementById('summary-price');
    var summaryDate     = document.getElementById('summary-date');
    var summaryTime     = document.getElementById('summary-time');
    var summaryLocation = document.getElementById('summary-location');
    var summaryTotal    = document.getElementById('summary-total');

    var servicePrices = {
      'classic-manicure':       1500,
      'gel-manicure':           2500,
      'nail-art':               3000,
      'classic-pedicure':       2000,
      'spa-pedicure':           3500,
      'fashion-consultation':   5000,
    };

    var serviceLabels = {
      'classic-manicure':       'Classic Manicure',
      'gel-manicure':           'Gel Manicure',
      'nail-art':               'Nail Art',
      'classic-pedicure':       'Classic Pedicure',
      'spa-pedicure':           'Spa Pedicure',
      'fashion-consultation':   'Fashion Consultation',
    };

    function updateSummary() {
      var svcVal   = serviceSelect  ? serviceSelect.value  : '';
      var dateVal  = dateInput      ? dateInput.value      : '';
      var timeVal  = timeInput      ? timeInput.value      : '';
      var locVal   = locationSelect ? locationSelect.value : '';

      var label = serviceLabels[svcVal] || '—';
      var price = servicePrices[svcVal] || 0;

      // Format date nicely
      var dateDisplay = dateVal
        ? new Date(dateVal + 'T00:00:00').toLocaleDateString('en-KE', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })
        : '—';

      // Format time nicely
      var timeDisplay = '—';
      if (timeVal) {
        var parts = timeVal.split(':');
        var h = parseInt(parts[0], 10);
        var m = parts[1];
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        timeDisplay = h + ':' + m + ' ' + ampm;
      }

      var locDisplay = locVal === 'home'   ? 'Home Visit'
                     : locVal === 'salon'  ? 'Salon'
                     : locVal             ? locVal
                     : '—';

      if (summaryService)  summaryService.textContent  = label;
      if (summaryPrice)    summaryPrice.textContent     = price ? formatCurrency(price) : '—';
      if (summaryDate)     summaryDate.textContent      = dateDisplay;
      if (summaryTime)     summaryTime.textContent      = timeDisplay;
      if (summaryLocation) summaryLocation.textContent  = locDisplay;
      if (summaryTotal)    summaryTotal.textContent      = price ? formatCurrency(price) : '—';
    }

    [serviceSelect, dateInput, timeInput, locationSelect].forEach(function (el) {
      if (el) el.addEventListener('change', updateSummary);
    });

    // Also support typing in date/time inputs
    if (dateInput)  dateInput.addEventListener('input',  updateSummary);
    if (timeInput)  timeInput.addEventListener('input',  updateSummary);

    // Run once on load to populate defaults
    updateSummary();

    // Also pre-select service if URL has ?look= or ?service= param
    try {
      var params = new URLSearchParams(window.location.search);
      var preService = params.get('service');
      if (preService && serviceSelect) {
        serviceSelect.value = preService;
        updateSummary();
      }
    } catch (_) { /* noop */ }

  } catch (e) {
    console.warn('[DaphyDesigns] Booking Form Live Summary:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     7. BOOKING SUCCESS MODAL
  ═══════════════════════════════════════════════════════════════ */
  try {
    var bookingForm    = document.getElementById('booking-form');
    var successModal   = document.getElementById('success-modal');
    var submitBtn      = bookingForm ? bookingForm.querySelector('[type="submit"]') : null;

    if (bookingForm) {
      bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!submitBtn) return;

        // Loading state
        var originalText        = submitBtn.textContent;
        submitBtn.textContent   = 'Processing…';
        submitBtn.disabled      = true;
        submitBtn.classList.add('loading');

        setTimeout(function () {
          // Remove loading state
          submitBtn.textContent = originalText;
          submitBtn.disabled    = false;
          submitBtn.classList.remove('loading');

          // Show success modal
          if (successModal) {
            successModal.classList.remove('hidden');
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
          } else {
            showToast('🌸 Booking confirmed! We\'ll contact you shortly on WhatsApp.', 5000);
          }
        }, 1500);
      });

      // Close success modal
      function closeSuccessModal() {
        if (successModal) {
          successModal.classList.add('hidden');
          successModal.classList.remove('active');
          document.body.style.overflow = '';
          bookingForm.reset();
          // Re-run summary update so card resets
          var updateEvt = new Event('change');
          var svc = document.getElementById('service');
          if (svc) svc.dispatchEvent(updateEvt);
        }
      }

      if (successModal) {
        // Close on overlay click
        var smOverlay = successModal.querySelector('.modal-overlay, .success-overlay');
        if (smOverlay) smOverlay.addEventListener('click', closeSuccessModal);

        // Close on close button
        var smClose = successModal.querySelector('.modal-close, .success-close, [data-close-modal]');
        if (smClose) smClose.addEventListener('click', closeSuccessModal);

        // Close on Escape
        document.addEventListener('keydown', function (ev) {
          if (ev.key === 'Escape' && successModal.classList.contains('active')) {
            closeSuccessModal();
          }
        });
      }
    }
  } catch (e) {
    console.warn('[DaphyDesigns] Booking Success Modal:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     8. FAQ ACCORDION
  ═══════════════════════════════════════════════════════════════ */
  try {
    var faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length) {
      faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question, button, [data-faq-toggle]');
        var answer   = item.querySelector('.faq-answer, .faq-panel, [data-faq-panel]');

        if (!question || !answer) return;

        // Initialise closed
        answer.style.maxHeight  = '0';
        answer.style.overflow   = 'hidden';
        answer.style.transition = 'max-height 0.35s ease';

        question.addEventListener('click', function () {
          var isOpen = item.classList.contains('open');

          // Close all items
          faqItems.forEach(function (fi) {
            var ans = fi.querySelector('.faq-answer, .faq-panel, [data-faq-panel]');
            fi.classList.remove('open');
            if (fi !== item && ans) {
              ans.style.maxHeight = '0';
            }
            var q = fi.querySelector('.faq-question, button, [data-faq-toggle]');
            if (q) q.setAttribute('aria-expanded', 'false');
          });

          // Toggle clicked item
          if (!isOpen) {
            item.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            question.setAttribute('aria-expanded', 'true');
          } else {
            answer.style.maxHeight = '0';
            question.setAttribute('aria-expanded', 'false');
          }
        });

        // Accessibility defaults
        question.setAttribute('aria-expanded', 'false');
      });
    }
  } catch (e) {
    console.warn('[DaphyDesigns] FAQ Accordion:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     9. ADD TO CART
  ═══════════════════════════════════════════════════════════════ */
  try {
    /** @type {Array<{id:string, name:string, price:number, qty:number, image:string}>} */
    var cart = [];

    var cartBadge       = document.getElementById('cart-badge');
    var cartDrawer      = document.getElementById('cart-drawer');
    var cartItemsList   = document.getElementById('cart-items');
    var cartTotalEl     = document.getElementById('cart-total');
    var cartEmptyState  = document.getElementById('cart-empty');

    /** Return total number of items across all products */
    function cartTotalQty() {
      return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    }

    /** Return total price */
    function cartTotalPrice() {
      return cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
    }

    /** Update badge number */
    function updateCartBadge() {
      var count = cartTotalQty();
      if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'flex' : 'none';
      }
    }

    /** Render cart drawer items */
    function renderCartDrawer() {
      if (!cartItemsList) return;

      if (cart.length === 0) {
        cartItemsList.innerHTML = '';
        if (cartEmptyState)  cartEmptyState.style.display = 'block';
        if (cartTotalEl)     cartTotalEl.textContent = formatCurrency(0);
        return;
      }

      if (cartEmptyState) cartEmptyState.style.display = 'none';

      cartItemsList.innerHTML = cart.map(function (item) {
        return [
          '<li class="cart-item" data-id="' + item.id + '">',
          '  <img src="' + item.image + '" alt="' + item.name + '" width="56" height="56" style="object-fit:cover;border-radius:8px;">',
          '  <div class="cart-item-info">',
          '    <span class="cart-item-name">' + item.name + '</span>',
          '    <span class="cart-item-price">' + formatCurrency(item.price) + '</span>',
          '  </div>',
          '  <div class="cart-item-qty">',
          '    <button class="qty-dec" data-id="' + item.id + '" aria-label="Decrease quantity">−</button>',
          '    <span>' + item.qty + '</span>',
          '    <button class="qty-inc" data-id="' + item.id + '" aria-label="Increase quantity">+</button>',
          '  </div>',
          '  <button class="cart-item-remove" data-id="' + item.id + '" aria-label="Remove item">&times;</button>',
          '</li>',
        ].join('');
      }).join('');

      if (cartTotalEl) cartTotalEl.textContent = formatCurrency(cartTotalPrice());

      // Qty / remove button handlers (re-bind after re-render)
      cartItemsList.querySelectorAll('.qty-dec').forEach(function (btn) {
        btn.addEventListener('click', function () {
          adjustQty(btn.dataset.id, -1);
        });
      });
      cartItemsList.querySelectorAll('.qty-inc').forEach(function (btn) {
        btn.addEventListener('click', function () {
          adjustQty(btn.dataset.id, 1);
        });
      });
      cartItemsList.querySelectorAll('.cart-item-remove').forEach(function (btn) {
        btn.addEventListener('click', function () {
          removeFromCart(btn.dataset.id);
        });
      });
    }

    function adjustQty(id, delta) {
      var idx = cart.findIndex(function (i) { return i.id === id; });
      if (idx === -1) return;
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
      updateCartBadge();
      renderCartDrawer();
    }

    function removeFromCart(id) {
      cart = cart.filter(function (i) { return i.id !== id; });
      updateCartBadge();
      renderCartDrawer();
    }

    /** Animate cart icon with a quick bounce */
    function bounceCartIcon() {
      var cartIcon = document.querySelector('.cart-icon, #cart-icon, .cart-btn');
      if (!cartIcon) return;
      cartIcon.classList.add('bounce');
      setTimeout(function () { cartIcon.classList.remove('bounce'); }, 600);
    }

    // Delegate clicks on all "Add to Cart" buttons
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.add-to-cart, [data-action="add-to-cart"]');
      if (!btn) return;

      var card = btn.closest('[data-id], .product-card, .product-item');
      if (!card) return;

      var id    = card.dataset.id    || btn.dataset.id    || ('product-' + Math.random().toString(36).slice(2, 7));
      var name  = card.dataset.name  || btn.dataset.name  || card.querySelector('.product-name, h3, h4')?.textContent?.trim() || 'Product';
      var price = parseInt(card.dataset.price || btn.dataset.price || '0', 10);
      var image = card.dataset.image || btn.dataset.image || card.querySelector('img')?.src || '';

      var existing = cart.find(function (i) { return i.id === id; });
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id: id, name: name, price: price, qty: 1, image: image });
      }

      updateCartBadge();
      renderCartDrawer();
      bounceCartIcon();
      showToast('Added to cart! 🛍️');
    });

    // Initial render
    updateCartBadge();
    renderCartDrawer();

  } catch (e) {
    console.warn('[DaphyDesigns] Add to Cart:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     10. CART DRAWER TOGGLE
  ═══════════════════════════════════════════════════════════════ */
  try {
    var cartDrawerEl  = document.getElementById('cart-drawer');
    var cartIconBtn   = document.querySelector('.cart-icon, #cart-icon, .cart-btn, [data-open-cart]');
    var cartCloseBtn  = document.querySelector('#cart-drawer .cart-close, #cart-drawer [data-close-cart]');

    function openCartDrawer() {
      if (cartDrawerEl) {
        cartDrawerEl.classList.add('open');
        document.body.classList.add('overlay-active');
      }
    }

    function closeCartDrawer() {
      if (cartDrawerEl) {
        cartDrawerEl.classList.remove('open');
        document.body.classList.remove('overlay-active');
      }
    }

    if (cartIconBtn) cartIconBtn.addEventListener('click', openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);

    // Close on backdrop / overlay click
    document.addEventListener('click', function (e) {
      if (
        cartDrawerEl &&
        cartDrawerEl.classList.contains('open') &&
        !cartDrawerEl.contains(e.target) &&
        !(cartIconBtn && cartIconBtn.contains(e.target))
      ) {
        closeCartDrawer();
      }
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCartDrawer();
    });

  } catch (e) {
    console.warn('[DaphyDesigns] Cart Drawer Toggle:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     11. NEWSLETTER FORM
  ═══════════════════════════════════════════════════════════════ */
  try {
    var newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var emailInput = form.querySelector('input[type="email"], input[name="email"]');
        if (!emailInput) return;

        var email = emailInput.value.trim();
        // Simple email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showToast('Please enter a valid email address.', 3000);
          emailInput.focus();
          return;
        }

        showToast('Thank you for subscribing! 🌸', 4000);
        emailInput.value = '';
      });
    });
  } catch (e) {
    console.warn('[DaphyDesigns] Newsletter Form:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     12. BACK-TO-TOP BUTTON
  ═══════════════════════════════════════════════════════════════ */
  try {
    var backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
      function toggleBackToTop() {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('visible');
          backToTopBtn.style.opacity    = '1';
          backToTopBtn.style.pointerEvents = 'auto';
        } else {
          backToTopBtn.classList.remove('visible');
          backToTopBtn.style.opacity    = '0';
          backToTopBtn.style.pointerEvents = 'none';
        }
      }

      backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      window.addEventListener('scroll', toggleBackToTop, { passive: true });
      toggleBackToTop(); // initial check
    }
  } catch (e) {
    console.warn('[DaphyDesigns] Back-to-Top:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     13. SMOOTH SCROLL (hash links)
  ═══════════════════════════════════════════════════════════════ */
  try {
    var navbarHeight = 0;

    function getNavbarHeight() {
      var nav = document.querySelector('nav, .navbar, header.site-header');
      return nav ? nav.offsetHeight : 72;
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href   = anchor.getAttribute('href');
        if (!href || href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        navbarHeight = getNavbarHeight();

        var targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      });
    });
  } catch (e) {
    console.warn('[DaphyDesigns] Smooth Scroll:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     14. SCROLL REVEAL (IntersectionObserver)
  ═══════════════════════════════════════════════════════════════ */
  try {
    if ('IntersectionObserver' in window) {
      var revealEls = document.querySelectorAll('.reveal');

      if (revealEls.length) {
        var revealObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );

        revealEls.forEach(function (el) {
          revealObserver.observe(el);
        });
      }
    } else {
      // Fallback: reveal everything immediately
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  } catch (e) {
    console.warn('[DaphyDesigns] Scroll Reveal:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     15. PAYMENT METHOD TOGGLE
  ═══════════════════════════════════════════════════════════════ */
  try {
    var paymentRadios   = document.querySelectorAll('input[name="payment"]');
    var mpesaDetails    = document.getElementById('mpesa-details');
    var cardDetails     = document.getElementById('card-details');

    /** Hide all payment detail panels */
    function hideAllPaymentPanels() {
      [mpesaDetails, cardDetails].forEach(function (panel) {
        if (!panel) return;
        panel.style.maxHeight   = '0';
        panel.style.overflow    = 'hidden';
        panel.style.opacity     = '0';
        panel.style.transition  = 'max-height 0.35s ease, opacity 0.35s ease';
        panel.setAttribute('aria-hidden', 'true');
      });
    }

    /** Show a specific payment panel with animation */
    function showPaymentPanel(panel) {
      if (!panel) return;
      panel.style.maxHeight   = panel.scrollHeight + 'px';
      panel.style.opacity     = '1';
      panel.removeAttribute('aria-hidden');
    }

    if (paymentRadios.length) {
      // Initialise panels as hidden
      if (mpesaDetails) {
        mpesaDetails.style.maxHeight  = '0';
        mpesaDetails.style.overflow   = 'hidden';
        mpesaDetails.style.opacity    = '0';
        mpesaDetails.style.transition = 'max-height 0.35s ease, opacity 0.35s ease';
        mpesaDetails.setAttribute('aria-hidden', 'true');
      }
      if (cardDetails) {
        cardDetails.style.maxHeight  = '0';
        cardDetails.style.overflow   = 'hidden';
        cardDetails.style.opacity    = '0';
        cardDetails.style.transition = 'max-height 0.35s ease, opacity 0.35s ease';
        cardDetails.setAttribute('aria-hidden', 'true');
      }

      paymentRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
          hideAllPaymentPanels();

          if (radio.value === 'mpesa' && radio.checked) {
            showPaymentPanel(mpesaDetails);
          } else if (radio.value === 'card' && radio.checked) {
            showPaymentPanel(cardDetails);
          }
          // 'salon' — no extra panel needed
        });
      });

      // Reflect any pre-selected value on page load
      var checkedRadio = document.querySelector('input[name="payment"]:checked');
      if (checkedRadio) {
        checkedRadio.dispatchEvent(new Event('change'));
      }
    }
  } catch (e) {
    console.warn('[DaphyDesigns] Payment Method Toggle:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     16. MOBILE BOOKING BAR
  ═══════════════════════════════════════════════════════════════ */
  try {
    var mobileBookingBar = document.getElementById('mobile-booking-bar');

    if (mobileBookingBar) {
      // Hide bar entirely on the booking page itself
      var currentPageFile = window.location.pathname.split('/').pop();
      if (currentPageFile === 'booking.html') {
        mobileBookingBar.style.display = 'none';
      } else {
        // Show bar after user scrolls past the hero (approx 80vh)
        var heroHeight  = window.innerHeight * 0.8;
        var barVisible  = false;

        function toggleMobileBookingBar() {
          if (window.scrollY > heroHeight && !barVisible) {
            mobileBookingBar.classList.add('visible');
            barVisible = true;
          } else if (window.scrollY <= heroHeight && barVisible) {
            mobileBookingBar.classList.remove('visible');
            barVisible = false;
          }
        }

        window.addEventListener('scroll', toggleMobileBookingBar, { passive: true });
        toggleMobileBookingBar();
      }
    }
  } catch (e) {
    console.warn('[DaphyDesigns] Mobile Booking Bar:', e);
  }


  /* ═══════════════════════════════════════════════════════════════
     EXTRA: Inject .bounce keyframe CSS once for cart icon animation
  ═══════════════════════════════════════════════════════════════ */
  try {
    if (!document.getElementById('daphy-dynamic-styles')) {
      var dynStyle = document.createElement('style');
      dynStyle.id  = 'daphy-dynamic-styles';
      dynStyle.textContent = [
        '@keyframes daphyBounce{0%,100%{transform:scale(1);}30%{transform:scale(1.35);}60%{transform:scale(0.92);}}',
        '.bounce{animation:daphyBounce 0.6s ease;}',
        /* Scroll reveal defaults */
        '.reveal{opacity:0;transform:translateY(28px);transition:opacity 0.6s ease,transform 0.6s ease;}',
        '.reveal.revealed{opacity:1;transform:translateY(0);}',
        /* Cart badge */
        '#cart-badge{display:none;position:absolute;top:-6px;right:-6px;background:#B76E79;color:#fff;border-radius:999px;font-size:0.65rem;width:18px;height:18px;align-items:center;justify-content:center;font-weight:700;}',
        /* Gallery hidden state */
        '[data-category].hidden,.gallery-item.hidden{display:none!important;}',
        /* Mobile booking bar */
        '#mobile-booking-bar{position:fixed;bottom:0;left:0;right:0;z-index:8000;transform:translateY(100%);transition:transform 0.35s ease;}',
        '#mobile-booking-bar.visible{transform:translateY(0);}',
        /* Back-to-top */
        '#back-to-top{opacity:0;pointer-events:none;transition:opacity 0.3s ease;}',
        '#back-to-top.visible{opacity:1;pointer-events:auto;}',
      ].join('\n');
      document.head.appendChild(dynStyle);
    }
  } catch (e) {
    console.warn('[DaphyDesigns] Dynamic Styles:', e);
  }


}); // end DOMContentLoaded
