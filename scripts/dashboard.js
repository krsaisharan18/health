/**
 * Dashboard functionality and interactions
 */

// Dashboard state management
const dashboardState = {
  currentUser: {
    name: 'Raj Patel',
    email: 'raj@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    goals: {
      steps: 10000,
      water: 8,
      calories: 2000,
      exercise: 45
    }
  },
  todayStats: {
    steps: 7500,
    water: 6,
    calories: 1450,
    sleep: 7.5,
    exercise: 30
  },
  weeklyData: {
    steps: [8000, 9500, 7200, 10500, 8800, 6500, 7500],
    calories: [1800, 2100, 1650, 2300, 1950, 1400, 1450],
    water: [7, 8, 6, 8, 7, 5, 6]
  }
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  setupEventListeners();
  updateDashboardData();
});

function initializeDashboard() {
  // Update welcome message based on time
  updateWelcomeMessage();
  
  // Update progress bars
  updateProgressBars();
  
  // Initialize charts if not already done
  if (!window.activityChartInitialized) {
    initializeActivityChart();
  }
}

function updateWelcomeMessage() {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  let emoji = '🌅';
  
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    emoji = '☀️';
  } else if (hour >= 17) {
    greeting = 'Good evening';
    emoji = '🌆';
  }
  
  const welcomeTitle = document.querySelector('[data-id="welcome-title"]');
  if (welcomeTitle) {
    welcomeTitle.textContent = `${greeting}, ${dashboardState.currentUser.name}! ${emoji}`;
  }
  
  // Update subtitle with motivational message
  const welcomeSubtitle = document.querySelector('[data-id="welcome-subtitle"]');
  if (welcomeSubtitle) {
    const stepsLeft = dashboardState.currentUser.goals.steps - dashboardState.todayStats.steps;
    if (stepsLeft > 0) {
      welcomeSubtitle.textContent = `You're ${stepsLeft.toLocaleString()} steps away from your daily goal. Keep it up!`;
    } else {
      welcomeSubtitle.textContent = `🎉 Congratulations! You've reached your daily step goal!`;
    }
  }
}

function updateProgressBars() {
  // Update steps progress
  updateProgressCard('steps', dashboardState.todayStats.steps, dashboardState.currentUser.goals.steps);
  
  // Update water progress
  updateProgressCard('water', dashboardState.todayStats.water, dashboardState.currentUser.goals.water);
  
  // Update calories progress
  updateProgressCard('calories', dashboardState.todayStats.calories, dashboardState.currentUser.goals.calories);
  
  // Update sleep (assuming 8 hours is ideal)
  updateProgressCard('sleep', dashboardState.todayStats.sleep, 8);
}

function updateProgressCard(type, current, goal) {
  const card = document.querySelector(`[data-id="${type}-card"]`);
  if (!card) return;
  
  const percentage = Math.min((current / goal) * 100, 100);
  const progressBar = card.querySelector('.bg-primary, .bg-accent, .bg-orange-500, .bg-purple-500');
  
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
  
  // Update display value
  const valueElement = card.querySelector('.text-2xl, .text-3xl');
  if (valueElement) {
    if (type === 'water') {
      valueElement.textContent = `${current}/${goal}`;
    } else if (type === 'sleep') {
      valueElement.textContent = `${current}h`;
    } else {
      valueElement.textContent = current.toLocaleString();
    }
  }
}

function setupEventListeners() {
  // User dropdown toggle
  const dropdownToggle = document.querySelector('[data-id="user-dropdown-toggle"]');
  const dropdown = document.querySelector('[data-id="user-dropdown"]');
  
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }
  
  // Quick action buttons
  setupQuickActions();
  
  // Log activity button
  const logActivityBtn = document.querySelector('[data-id="log-activity"]');
  if (logActivityBtn) {
    logActivityBtn.addEventListener('click', () => {
      showLogActivityModal();
    });
  }
  
  // View reports button
  const viewReportsBtn = document.querySelector('[data-id="view-reports"]');
  if (viewReportsBtn) {
    viewReportsBtn.addEventListener('click', () => {
      generateHealthReport();
    });
  }
}

function setupQuickActions() {
  // Add water button
  const addWaterBtn = document.querySelector('[data-id="action-water"]');
  if (addWaterBtn) {
    addWaterBtn.addEventListener('click', () => {
      addWater();
    });
  }
  
  // Log steps button
  const logStepsBtn = document.querySelector('[data-id="action-steps"]');
  if (logStepsBtn) {
    logStepsBtn.addEventListener('click', () => {
      showStepsModal();
    });
  }
  
  // Add meal button
  const addMealBtn = document.querySelector('[data-id="action-meal"]');
  if (addMealBtn) {
    addMealBtn.addEventListener('click', () => {
      window.location.href = 'nutrition.html';
    });
  }
  
  // Exercise button
  const exerciseBtn = document.querySelector('[data-id="action-exercise"]');
  if (exerciseBtn) {
    exerciseBtn.addEventListener('click', () => {
      window.location.href = 'exercises.html';
    });
  }
}

function addWater() {
  if (dashboardState.todayStats.water < dashboardState.currentUser.goals.water) {
    dashboardState.todayStats.water += 1;
    updateProgressCard('water', dashboardState.todayStats.water, dashboardState.currentUser.goals.water);
    
    // Show success feedback
    showToast('💧 Great! You added 1 glass of water.', 'success');
    
    // Check if goal is reached
    if (dashboardState.todayStats.water === dashboardState.currentUser.goals.water) {
      setTimeout(() => {
        showToast('🎉 Congratulations! You reached your water goal!', 'success');
      }, 1000);
    }
  } else {
    showToast('You\'ve already reached your water goal for today!', 'info');
  }
}

function showStepsModal() {
  // Simple prompt for demo (in real app, would be a proper modal)
  const steps = prompt('How many steps did you take?');
  if (steps && !isNaN(steps)) {
    const newSteps = Math.max(0, parseInt(steps));
    dashboardState.todayStats.steps = newSteps;
    updateProgressCard('steps', newSteps, dashboardState.currentUser.goals.steps);
    updateWelcomeMessage();
    showToast(`✅ Steps updated to ${newSteps.toLocaleString()}!`, 'success');
  }
}

function showLogActivityModal() {
  // Demo implementation
  const activities = ['Walking', 'Running', 'Yoga', 'Gym Workout', 'Cycling'];
  const activity = activities[Math.floor(Math.random() * activities.length)];
  const duration = Math.floor(Math.random() * 45) + 15; // 15-60 minutes
  const calories = Math.floor(Math.random() * 200) + 100; // 100-300 calories
  
  showToast(`📝 Logged: ${activity} for ${duration} minutes (${calories} calories)`, 'success');
}

function generateHealthReport() {
  showToast('📊 Generating your health report...', 'info');
  
  // Simulate report generation
  setTimeout(() => {
    const reportData = {
      week: 'Nov 11-17, 2024',
      avgSteps: Math.floor(dashboardState.weeklyData.steps.reduce((a, b) => a + b, 0) / 7),
      avgWater: Math.floor(dashboardState.weeklyData.water.reduce((a, b) => a + b, 0) / 7),
      totalCalories: dashboardState.weeklyData.calories.reduce((a, b) => a + b, 0),
      activeDays: dashboardState.weeklyData.steps.filter(steps => steps >= 5000).length
    };
    
    alert(`📊 Weekly Health Report (${reportData.week})
    
📍 Average Steps: ${reportData.avgSteps.toLocaleString()}/day
💧 Average Water: ${reportData.avgWater} glasses/day  
🔥 Total Calories: ${reportData.totalCalories.toLocaleString()}
✅ Active Days: ${reportData.activeDays}/7 days

Keep up the great work! 💪`);
  }, 2000);
}

function updateDashboardData() {
  // Simulate real-time updates (in real app, this would fetch from API)
  setInterval(() => {
    // Randomly update some stats slightly (demo purposes)
    if (Math.random() > 0.7) {
      const randomSteps = Math.floor(Math.random() * 100);
      dashboardState.todayStats.steps = Math.min(
        dashboardState.todayStats.steps + randomSteps,
        dashboardState.currentUser.goals.steps + 2000
      );
      updateProgressCard('steps', dashboardState.todayStats.steps, dashboardState.currentUser.goals.steps);
      updateWelcomeMessage();
    }
  }, 30000); // Update every 30 seconds
}

function initializeActivityChart() {
  const ctx = document.getElementById('activityChart')?.getContext('2d');
  if (!ctx) return;
  
  window.activityChartInitialized = true;
  
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Steps',
        data: dashboardState.weeklyData.steps,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#16a34a',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: function(context) {
              return context[0].label;
            },
            label: function(context) {
              return `${context.parsed.y.toLocaleString()} steps`;
            },
            afterLabel: function(context) {
              const value = context.parsed.y;
              if (value >= 10000) return '🎯 Goal achieved!';
              if (value >= 7500) return '💪 Almost there!';
              if (value >= 5000) return '👍 Good progress';
              return '🚶‍♂️ Keep walking';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 12
            },
            callback: function(value) {
              return value >= 1000 ? (value / 1000) + 'k' : value;
            }
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 12
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
  
  // Chart type switching
  const chartButtons = document.querySelectorAll('[data-id="activity-chart"] button');
  chartButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Remove active state from all buttons
      chartButtons.forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-600');
      });
      
      // Add active state to clicked button
      button.classList.remove('bg-gray-200', 'text-gray-600');
      button.classList.add('bg-primary', 'text-white');
      
      // Update chart data based on selection
      const dataTypes = ['steps', 'calories', 'distance'];
      const labels = ['Steps', 'Calories', 'Distance (km)'];
      const datasets = [
        dashboardState.weeklyData.steps,
        dashboardState.weeklyData.calories,
        [3.2, 4.1, 2.8, 4.8, 3.9, 2.5, 3.1] // distance data
      ];
      
      chart.data.datasets[0].data = datasets[index];
      chart.data.datasets[0].label = labels[index];
      chart.options.plugins.tooltip.callbacks.label = function(context) {
        const suffixes = ['steps', 'cal', 'km'];
        return `${context.parsed.y.toLocaleString()} ${suffixes[index]}`;
      };
      chart.update('active');
    });
  });
}

// Toast notification system
function showToast(message, type = 'info') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast-notification fixed top-4 right-4 z-50 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 transform transition-all duration-300 translate-x-full`;
  
  // Set colors based on type
  const colors = {
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-blue-200 bg-blue-50'
  };
  
  toast.className += ` ${colors[type] || colors.info}`;
  
  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="text-sm font-medium text-gray-900">${message}</div>
      <button class="text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Initialize lucide icons for the toast
  lucide.createIcons();
  
  // Slide in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// Meal interactions
document.addEventListener('DOMContentLoaded', function() {
  // Add dinner functionality
  const addDinnerBtn = document.querySelector('[data-id="add-dinner"] button');
  if (addDinnerBtn) {
    addDinnerBtn.addEventListener('click', () => {
      const dinnerOptions = [
        { name: 'Dal Rice + Sabzi', calories: 380 },
        { name: 'Khichdi + Curd', calories: 320 },
        { name: '2 Roti + Dal + Sabzi', calories: 420 },
        { name: 'South Indian Meal', calories: 350 }
      ];
      
      const randomDinner = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];
      
      // Update the add dinner card
      const addDinnerCard = document.querySelector('[data-id="add-dinner"]');
      if (addDinnerCard) {
        addDinnerCard.outerHTML = `
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl" data-id="meal-3">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <i data-lucide="moon" class="w-6 h-6 text-purple-500"></i>
              </div>
              <div>
                <div class="font-medium text-gray-900">Dinner</div>
                <div class="text-sm text-gray-600">${randomDinner.name}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-semibold text-gray-900">${randomDinner.calories} cal</div>
              <div class="text-sm text-gray-600">Just added</div>
            </div>
          </div>
        `;
        
        // Reinitialize lucide icons
        lucide.createIcons();
        
        showToast(`🍽️ Added ${randomDinner.name} to dinner!`, 'success');
        
        // Update calorie count
        dashboardState.todayStats.calories += randomDinner.calories;
        updateProgressCard('calories', dashboardState.todayStats.calories, dashboardState.currentUser.goals.calories);
      }
    });
  }
});

// Export dashboard functions for use in other scripts
window.dashboardUtils = {
  showToast,
  updateProgressCard,
  addWater,
  generateHealthReport
};