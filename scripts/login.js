// Login page functionality
class LoginPage {
  constructor() {
    this.form = document.querySelector('[data-id="login-form"]');
    this.init();
  }

  init() {
    this.initPasswordToggle();
    this.initFormValidation();
    this.initSocialLogin();
    this.initDemoLogin();
  }

  initPasswordToggle() {
    const passwordInput = document.querySelector('[data-id="password-input"]');
    const passwordToggle = document.querySelector('[data-id="password-toggle"]');

    if (passwordToggle && passwordInput) {
      passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        const icon = passwordToggle.querySelector('i');
        icon.setAttribute('data-lucide', isPassword ? 'eye' : 'eye-off');
        lucide.createIcons();
      });
    }
  }

  initFormValidation() {
    if (!this.form) return;

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Real-time validation
    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'This field is required';
    }

    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      message = 'Please enter a valid email address';
    }

    if (field.type === 'password' && value && value.length < 6) {
      isValid = false;
      message = 'Password must be at least 6 characters long';
    }

    this.showFieldValidation(field, isValid, message);
    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showFieldValidation(field, isValid, message) {
    this.clearFieldError(field);

    if (!isValid) {
      field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'text-red-500 text-sm mt-1 field-error';
      errorDiv.textContent = message;
      
      field.parentNode.appendChild(errorDiv);
    } else {
      field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    }
  }

  clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
    field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
  }

  async handleLogin() {
    const emailInput = document.querySelector('[data-id="email-input"]');
    const passwordInput = document.querySelector('[data-id="password-input"]');
    const rememberCheckbox = document.querySelector('[data-id="remember-checkbox"]');

    // Validate inputs
    const isEmailValid = this.validateField(emailInput);
    const isPasswordValid = this.validateField(passwordInput);

    if (!isEmailValid || !isPasswordValid) {
      this.showNotification('Please fix the errors in the form', 'error');
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;

    // Show loading state
    const submitBtn = document.querySelector('[data-id="login-submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin mr-2"></i>Signing In...';
    submitBtn.disabled = true;
    lucide.createIcons();

    try {
      // Simulate API call
      const loginResult = await this.simulateLogin(email, password);
      
      if (loginResult.success) {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        if (remember) {
          localStorage.setItem('rememberLogin', 'true');
        }

        // Store mock user data if it's a demo login
        if (email === 'demo@swasthya.com') {
          const mockUserData = {
            firstname: 'Demo',
            lastname: 'User',
            email: 'demo@swasthya.com',
            age: 28,
            gender: 'male',
            height: 175,
            weight: 70,
            bmi: '22.9',
            diet: 'vegetarian',
            city: 'Mumbai'
          };
          localStorage.setItem('userData', JSON.stringify(mockUserData));
        }

        this.showNotification('Login successful! Redirecting to dashboard...', 'success');
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        this.showNotification(loginResult.message || 'Invalid email or password', 'error');
      }
    } catch (error) {
      this.showNotification('Login failed. Please try again.', 'error');
      console.error('Login error:', error);
    } finally {
      // Restore button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      lucide.createIcons();
    }
  }

  async simulateLogin(email, password) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check for demo account
        if (email === 'demo@swasthya.com' && password === 'demo123') {
          resolve({ success: true, userId: 'demo-user-123' });
        } else {
          // Simulate random success for other emails (for demo purposes)
          const isSuccess = Math.random() > 0.3; // 70% success rate
          resolve({ 
            success: isSuccess,
            message: isSuccess ? 'Login successful' : 'Invalid email or password'
          });
        }
      }, 1500);
    });
  }

  initSocialLogin() {
    const googleBtn = document.querySelector('[data-id="google-login"]');
    const facebookBtn = document.querySelector('[data-id="facebook-login"]');

    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        this.showNotification('Google login integration coming soon!', 'info');
      });
    }

    if (facebookBtn) {
      facebookBtn.addEventListener('click', () => {
        this.showNotification('Facebook login integration coming soon!', 'info');
      });
    }
  }

  initDemoLogin() {
    const demoBtn = document.querySelector('[data-id="demo-login"]');
    
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        const emailInput = document.querySelector('[data-id="email-input"]');
        const passwordInput = document.querySelector('[data-id="password-input"]');
        
        emailInput.value = 'demo@swasthya.com';
        passwordInput.value = 'demo123';
        
        this.showNotification('Demo credentials filled! Click Sign In to continue.', 'info');
      });
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
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

    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
      this.dismissNotification(notification);
    }, 5000);

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

// Initialize login page
new LoginPage();