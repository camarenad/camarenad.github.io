// Navigation and Contact functionality
document.addEventListener('DOMContentLoaded', function() {
  // Navigation elements
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active navigation link highlighting
  window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 150; // Add offset for better detection
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    // Special handling for the last section (contact)
    const lastSection = sections[sections.length - 1];
    if (lastSection) {
      const lastSectionTop = lastSection.offsetTop;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // If we're near the bottom of the page, activate the last section
      if (window.scrollY + windowHeight >= documentHeight - 100) {
        current = lastSection.getAttribute('id');
      }
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.glass-card, .stat-item, .experience-card, .skill-category');
  animateElements.forEach(el => {
    el.classList.add('animate-fade-up');
    observer.observe(el);
  });

  // Counter animation for stats
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        
        animateCounter(counter, target, suffix);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

    counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // Email reveal button event listener
  const emailRevealBtn = document.getElementById('email-reveal-btn');
  if (emailRevealBtn) {
    emailRevealBtn.addEventListener('click', function() {
      revealEmail(this);
    });
  }
});

// Counter animation function
function animateCounter(element, target, suffix) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 30);
}

// Email reveal functionality
function revealEmail(button) {
  // Construct email (bot-resistant method)
  const emailParts = ['dcamarena0229', 'gmail', 'com'];
  const email = emailParts[0] + '@' + emailParts[1] + '.' + emailParts[2];
  
  // Find elements
  const card = button.closest('.email-card');
  const revealedSection = card.querySelector('.email-revealed');
  const emailElement = document.getElementById('email-address');
  const composeLink = document.getElementById('email-compose');
  
  if (!card || !revealedSection || !emailElement || !composeLink) {
    console.error('Required elements not found for email reveal');
    return;
  }
  
  // Update email elements
  emailElement.textContent = email;
  composeLink.href = `mailto:${email}`;
  
  // Smooth transition
  button.style.transition = 'all 0.3s ease';
  button.style.opacity = '0';
  button.style.transform = 'translateY(-10px)';
  
  setTimeout(() => {
    button.style.display = 'none';
    revealedSection.style.display = 'block';
    revealedSection.style.opacity = '0';
    revealedSection.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      revealedSection.style.transition = 'all 0.4s ease';
      revealedSection.style.opacity = '1';
      revealedSection.style.transform = 'translateY(0)';
    }, 50);
  }, 300);
  
  showNotification('📧 Email address revealed!', 'success');
}

// Copy email to clipboard
function copyEmail() {
  const emailElement = document.getElementById('email-address');
  const copyBtn = document.querySelector('.email-action[onclick="copyEmail()"]');
  
  if (!emailElement || !copyBtn) return;
  
  const email = emailElement.textContent;
  
  // Modern clipboard API
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email).then(() => {
      // Success feedback
      const originalIcon = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      copyBtn.style.background = 'var(--primary-color)';
      copyBtn.style.borderColor = 'var(--primary-color)';
      copyBtn.style.color = 'white';
      
      setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
        copyBtn.style.background = '';
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
      }, 2000);
      
      showNotification('📋 Email copied to clipboard!', 'success');
    }).catch(() => {
      fallbackCopyEmail(email);
    });
  } else {
    fallbackCopyEmail(email);
  }
}

// Fallback copy method for older browsers
function fallbackCopyEmail(email) {
  const textArea = document.createElement('textarea');
  textArea.value = email;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showNotification('📋 Email copied to clipboard!', 'success');
  } catch (err) {
    showNotification('❌ Copy failed. Please select the email manually.', 'error');
  }
  
  document.body.removeChild(textArea);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add styles
  const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
    font-size: 14px;
    font-weight: 500;
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 4000);
}

// Add notification animations and shake effect to head if not already present
if (!document.querySelector('#dynamic-styles')) {
  const style = document.createElement('style');
  style.id = 'dynamic-styles';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      opacity: 0.8;
      transition: opacity 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .notification-close:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }
  `;
  document.head.appendChild(style);
} 