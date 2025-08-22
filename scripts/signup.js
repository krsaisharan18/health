// Signup page functionality
class SignupPage {
  constructor() {
    this.form = document.querySelector('[data-id="signup-form"]');
    this.init();
  }

  init() {
    this.initPasswordToggle();
    this.initFormValidation();
    this.initSocialSignup();
    this.calculateBMI();
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

    // Real-time validation
    const inputs = this.form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignup();
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'This field is required';
    }

    // Specific validations
    switch (field.type) {
      case 'email':
        if (value && !this.isValidEmail(value)) {
          isValid = false;
          message = 'Please enter a valid email address';
        }
        break;
      case 'tel':
        if (value && !this.isValidPhone(value)) {
          isValid = false;
          message = 'Please enter a valid phone number';
        }
        break;
      case 'password':
        if (value && value.length < 8) {
          isValid = false;
          message = 'Password must be at least 8 characters long';
        }
        break;
      case 'number':
        const min = parseInt(field.getAttribute('min'));
        const max = parseInt(field.getAttribute('max'));
        const numValue = parseInt(value);
        
        if (value && (numValue < min || numValue > max)) {
          isValid = false;
          message = `Please enter a value between ${min} and ${max}`;
        }
        break;
    }

    this.showFieldValidation(field, isValid, message);
    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone) {
    return /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(phone.replace(/\s/g, ''));
  }

  showFieldValidation(field, isValid, message) {
    // Remove existing error
    this.clearFieldError(field);

    if (!isValid) {
      field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'text-red-500 text-sm mt-1 field-error';
      errorDiv.textContent = message;
      
      field.parentNode.appendChild(errorDiv);
    } else {
      field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
      field.classList.add('border-green-500');
    }
  }

  clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
    field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500', 'border-green-500');
  }

  calculateBMI() {
    const heightInput = document.querySelector('[data-id="height-input"]');
    const weightInput = document.querySelector('[data-id="weight-input"]');

    if (heightInput && weightInput) {
      const calculateAndShow = () => {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (height && weight) {
          const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
          let category = '';

          if (bmi < 18.5) category = 'Underweight';
          else if (bmi < 25) category = 'Normal';
          else if (bmi < 30) category = 'Overweight';
          else category = 'Obese';

          this.showBMIResult(bmi, category);
        }
      };

      heightInput.addEventListener('input', calculateAndShow);
      weightInput.addEventListener('input', calculateAndShow);
    }
  }

  showBMIResult(bmi, category) {
    // Remove existing BMI display
    const existingBMI = document.querySelector('.bmi-result');
    if (existingBMI) {
      existingBMI.remove();
    }

    // Create BMI display
    const bmiDiv = document.createElement('div');
    bmiDiv.className = 'bmi-result mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200';
    
    let categoryColor = 'text-blue-600';
    if (category === 'Underweight') categoryColor = 'text-yellow-600';
    else if (category === 'Normal') categoryColor = 'text-green-600';
    else if (category === 'Overweight') categoryColor = 'text-orange-600';
    else if (category === 'Obese') categoryColor = 'text-red-600';

    bmiDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Your BMI:</span>
        <div class="text-right">
          <span class="text-lg font-semibold text-gray-800">${bmi}</span>
          <span class="block text-sm ${categoryColor}">${category}</span>
        </div>
      </div>
    `;

    const weightInput = document.querySelector('[data-id="weight-input"]');
    weightInput.parentNode.appendChild(bmiDiv);
  }

  async handleSignup() {
    // Validate all fields
    const inputs = this.form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    // Check terms agreement
    const termsCheckbox = document.querySelector('[data-id="terms-checkbox"]');
    if (!termsCheckbox.checked) {
      isFormValid = false;
      this.showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
    }

    if (!isFormValid) {
      this.showNotification('Please fix the errors in the form', 'error');
      return;
    }

    // Collect form data
    const formData = new FormData(this.form);
    const userData = {};
    
    // Get all form values
    const inputs = this.form.querySelectorAll('input, select');
    inputs.forEach(input => {
      if (input.type !== 'checkbox') {
        userData[input.getAttribute('data-id')?.replace('-input', '')?.replace('-select', '') || input.name] = input.value;
      }
    });

    // Calculate BMI
    const height = parseFloat(userData.height);
    const weight = parseFloat(userData.weight);
    if (height && weight) {
      userData.bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    }

    // Show loading state
    const submitBtn = document.querySelector('[data-id="signup-submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin mr-2"></i>Creating Account...';
    submitBtn.disabled = true;
    lucide.createIcons();

    try {
      // Simulate API call (replace with actual backend integration)
      await this.simulateSignup(userData);
      
      // Store user data locally (for demo purposes)
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      this.showNotification('Account created successfully! Redirecting to dashboard...', 'success');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);

    } catch (error) {
      this.showNotification('Failed to create account. Please try again.', 'error');
      console.error('Signup error:', error);
    } finally {
      // Restore button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      lucide.createIcons();
    }
  }

  async simulateSignup(userData) {
    // Simulate API delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        if (Math.random() > 0.1) { // 90% success rate
          resolve({ success: true, userId: Math.random().toString(36).substr(2, 9) });
        } else {
          reject(new Error('Network error'));
        }
      }, 2000);
    });
  }

  initSocialSignup() {
    const googleBtn = document.querySelector('[data-id="google-signup"]');
    const facebookBtn = document.querySelector('[data-id="facebook-signup"]');

    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        this.showNotification('Google signup integration coming soon!', 'info');
      });
    }

    if (facebookBtn) {
      facebookBtn.addEventListener('click', () => {
        this.showNotification('Facebook signup integration coming soon!', 'info');
      });
    }
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

// Initialize signup page
new SignupPage();