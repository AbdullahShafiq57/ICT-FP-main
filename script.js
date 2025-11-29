// Theme Management
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = current === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  updateThemeButton();
}

function updateThemeButton() {
  const themeBtn = document.getElementById('theme-toggle');
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  if (themeBtn) {
    if (current === 'light') {
      themeBtn.innerHTML = '<span style="font-size: 1.2rem;">🌙</span>';
      themeBtn.setAttribute('title', 'Switch to Dark Mode');
      themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      themeBtn.innerHTML = '<span style="font-size: 1.2rem;">☀️</span>';
      themeBtn.setAttribute('title', 'Switch to Light Mode');
      themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
  updateThemeButton();
  
  // Initialize all interactive features
  setupScrollReveal();
  setupSmoothScroll();
  setupFormHandlers();
  setupDemoInteractions();
  
  // Delay counter animation slightly to ensure DOM is ready
  setTimeout(function() {
    setupCounterAnimation();
  }, 100);
});

// Scroll Reveal Animations
function setupScrollReveal() {
  const reveals = document.querySelectorAll(
    '.feature-card, .product-tile, .news-card, .process-step, .pricing-card, .demo-box, .stat'
  );
  
  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  let staggerIndex = 0;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        staggerIndex++;
        const delay = (staggerIndex % 3) * 100;
        entry.target.style.animationDelay = delay + 'ms';
        entry.target.classList.add('reveal', 'show');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);
  
  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

// Smooth Scroll for Anchor Links
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
}

// Form Handlers
function setupFormHandlers() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Store in localStorage
      let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
      contacts.push({...data, timestamp: new Date().toISOString()});
      localStorage.setItem('contacts', JSON.stringify(contacts));
      
      showFormResult(this, 'Thank you! We\'ll get back to you soon.');
      this.reset();
    });
  }
  
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Store in localStorage
      let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      feedbacks.push({...data, timestamp: new Date().toISOString()});
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
      
      showFormResult(this, 'Thank you for your feedback!');
      this.reset();
    });
  }
}

function showFormResult(form, message) {
  const result = document.createElement('div');
  result.className = 'form-result';
  result.textContent = message;
  
  const existingResult = form.querySelector('.form-result');
  if (existingResult) existingResult.remove();
  
  form.appendChild(result);
  
  setTimeout(() => {
    result.style.animation = 'fadeInUp 0.3s ease-out';
  }, 0);
  
  setTimeout(() => {
    result.style.animation = 'slideDown 0.3s ease-out reverse';
    setTimeout(() => result.remove(), 300);
  }, 3000);
}

// Demo Interactions
function setupDemoInteractions() {
  const demoInputs = document.querySelectorAll('.demo-input');
  
  demoInputs.forEach(input => {
    input.addEventListener('input', function() {
      const output = this.parentElement.querySelector('.demo-output');
      if (output) {
        if (this.value.trim()) {
          output.classList.add('active');
          output.textContent = '🎯 Processing: ' + this.value;
        } else {
          output.classList.remove('active');
          output.textContent = 'Output will appear here...';
        }
      }
    });
  });
}

// Navigation highlight on scroll
window.addEventListener('scroll', function() {
  const navLinks = document.querySelectorAll('.site-nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          navLinks.forEach(l => l.style.color = 'var(--muted)');
          link.style.color = 'var(--text)';
        }
      }
    }
  });
});

// Page transitions
document.addEventListener('click', function(e) {
  const link = e.target.closest('a:not(a[href^="#"]):not(.link-arrow)');
  if (link && link.getAttribute('href') && link.getAttribute('href').endsWith('.html')) {
    if (!link.target) {
      e.preventDefault();
      const url = link.getAttribute('href');
      document.body.style.opacity = '0.5';
      setTimeout(() => {
        window.location.href = url;
      }, 150);
    }
  }
});

// Scroll progress bar (if exists)
window.addEventListener('scroll', function() {
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }
});

// Counter Animation for Stats
function setupCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  
  // Function to animate a counter
  function animateCounter(counter) {
    if (counter.dataset.animated === 'true') {
      return; // Already animated
    }
    
    counter.dataset.animated = 'true';
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2500; // 2.5 seconds animation
    const start = Date.now();
    
    function updateCounter() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = 1 - Math.pow(1 - progress, 2);
      const current = Math.floor(target * easeOutQuad);
      
      // Add counting class for glow effect
      counter.classList.add('counting');
      
      // Format large numbers
      if (target >= 1000000) {
        counter.textContent = (current / 1000000).toFixed(1) + 'M';
      } else if (target >= 100000) {
        counter.textContent = (current / 1000).toFixed(0) + 'K';
      } else {
        counter.textContent = current;
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Animation complete - show final value
        if (target >= 1000000) {
          counter.textContent = (target / 1000000).toFixed(1) + 'M';
        } else if (target >= 100000) {
          counter.textContent = (target / 1000).toFixed(0) + 'K';
        } else {
          counter.textContent = target;
        }
        counter.classList.add('counted');
        counter.classList.remove('counting');
      }
    }
    
    updateCounter();
  }
  
  // Set up intersection observer
  const counterOptions = {
    threshold: 0.1,
    rootMargin: '100px 0px 100px 0px'
  };
  
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.dataset.animated !== 'true') {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, counterOptions);
  
  // Observe all counters
  counters.forEach(counter => {
    // Reset animated state
    if (counter.dataset.animated === 'false' || !counter.dataset.animated) {
      counterObserver.observe(counter);
      
      // Check if counter is already visible (for above-the-fold content)
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        animateCounter(counter);
        counterObserver.unobserve(counter);
      }
    }
  });
}
