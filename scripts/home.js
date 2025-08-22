// Home page functionality
class HomePage {
  constructor() {
    this.init();
  }

  init() {
    this.initCTAButtons();
    this.initQuickActions();
    this.initAnimations();
  }

  initCTAButtons() {
    // Get started button
    const getStartedBtn = document.querySelector('[data-id="get-started-btn"]');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        window.location.href = 'signup.html';
      });
    }

    // Demo button
    const demoBtn = document.querySelector('[data-id="demo-btn"]');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        this.scrollToDemoSection();
      });
    }
  }

  initQuickActions() {
    // Mock quick action buttons in demo section
    const quickActionBtns = [
      { id: 'log-meal-btn', action: 'meal' },
      { id: 'add-water-btn', action: 'water' },
      { id: 'log-workout-btn', action: 'workout' },
      { id: 'view-insights-btn', action: 'insights' }
    ];

    quickActionBtns.forEach(({ id, action }) => {
      const btn = document.querySelector(`[data-id="${id}"]`);
      if (btn) {
        btn.addEventListener('click', () => {
          this.handleQuickAction(action);
        });
      }
    });
  }

  handleQuickAction(action) {
    // Show modal or redirect based on action
    switch (action) {
      case 'meal':
        this.showNotification('Meal logging - Sign up to start tracking your भोजन!', 'info');
        break;
      case 'water':
        this.showNotification('Water tracking - Stay hydrated! Sign up to track your daily intake.', 'info');
        break;
      case 'workout':
        this.showNotification('Workout logging - From yoga to gym sessions, track it all!', 'info');
        break;
      case 'insights':
        this.showNotification('Health insights - Get detailed analytics of your progress!', 'info');
        break;
    }
  }

  scrollToDemoSection() {
    const demoSection = document.querySelector('[data-id="demo-section"]');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  initAnimations() {
    // Animate stats on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStats();
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('[data-id="stats-section"]');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateStats() {
    const stats = [
      { id: 'stat-users', target: 10, suffix: 'K+' },
      { id: 'stat-workouts', target: 50, suffix: 'K+' },
      { id: 'stat-meals', target: 100, suffix: 'K+' },
      { id: 'stat-steps', target: 1, suffix: 'M+' }
    ];

    stats.forEach(({ id, target, suffix }) => {
      const element = document.querySelector(`[data-id="${id}"] h3`);
      if (element && !element.classList.contains('animated')) {
        element.classList.add('animated');
        this.countUp(element, target, suffix);
      }
    });
  }

  countUp(element, target, suffix) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 40);
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    // Set notification style based on type
    switch (type) {
      case 'info':
        notification.classList.add('bg-blue-500', 'text-white');
        break;
      case 'success':
        notification.classList.add('bg-green-500', 'text-white');
        break;
      case 'warning':
        notification.classList.add('bg-yellow-500', 'text-white');
        break;
      case 'error':
        notification.classList.add('bg-red-500', 'text-white');
        break;
    }

    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <i data-lucide="info" class="w-5 h-5"></i>
        <p class="text-sm">${message}</p>
        <button class="text-white/80 hover:text-white">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    `;

    document.body.appendChild(notification);
    lucide.createIcons();

    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      this.dismissNotification(notification);
    }, 5000);

    // Manual dismiss
    const dismissBtn = notification.querySelector('button');
    dismissBtn.addEventListener('click', () => {
      this.dismissNotification(notification);
    });
  }

  dismissNotification(notification) {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

// Initialize home page
new HomePage();