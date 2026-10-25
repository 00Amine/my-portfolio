// ================================================
// NAVBAR — Scroll effect, mobile toggle & theme switcher
// ================================================
document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlRoot = document.documentElement;

  // ================================================
  // THEME SWITCHER (Light / Dark with persistence)
  // ================================================
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || 'light'; // Clean light theme as default
  setTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back-to-top visibility
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ================================================
  // ACTIVE NAV LINK ON SCROLL
  // ================================================
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const observerOptions = {
    rootMargin: '-35% 0px -55% 0px',
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // ================================================
  // FADE-IN ON SCROLL
  // ================================================
  const fadeElements = document.querySelectorAll(
    '.timeline-item, .skill-category, .project-card, .stat-card, .edu-card, .cert-item, .contact-card'
  );

  fadeElements.forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ================================================
  // STAT COUNTER ANIMATION
  // ================================================
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // ================================================
  // SMOOTH SCROLL FOR ANCHORS
  // ================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ================================================
  // EMAIL & PHONE CLICK HANDLERS (COPY & TOAST)
  // ================================================
  const toast = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastBody = document.getElementById('toast-body');
  const toastClose = document.getElementById('toast-close');
  const toastActions = document.getElementById('toast-actions');
  let toastTimer = null;

  function showToast(title, bodyText, showActions = true) {
    if (!toast) return;
    if (toastTimer) clearTimeout(toastTimer);

    if (toastTitle) toastTitle.textContent = title;
    if (toastBody) toastBody.textContent = bodyText;
    if (toastActions) toastActions.style.display = showActions ? 'flex' : 'none';

    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 6000);
  }

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      if (toast) toast.classList.remove('show');
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) resolve();
        else reject(new Error('execCommand failed'));
      } catch (err) {
        reject(err);
      }
    });
  }

  // Handle email buttons
  document.querySelectorAll('.email-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'mohamedaminenourdine03@gmail.com';
      copyText(email)
        .then(() => {
          showToast('Email Copied to Clipboard', email, true);
        })
        .catch(() => {
          showToast('Contact Email', email, true);
        });
    });
  });

  // Handle phone buttons
  document.querySelectorAll('.phone-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const phoneDisplay = '+212 6 25 52 83 31';
      const phoneRaw = '+212625528331';
      if (window.innerWidth > 768) {
        e.preventDefault();
        copyText(phoneRaw)
          .then(() => {
            showToast('Phone Number Copied', phoneDisplay, false);
          })
          .catch(() => {
            showToast('Phone Number', phoneDisplay, false);
          });
      }
    });
  });

});
