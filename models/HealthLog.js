const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // Daily Metrics
  steps: {
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    goal: {
      type: Number,
      default: 10000
    },
    entries: [{
      count: Number,
      timestamp: {
        type: Date,
        default: Date.now
      },
      source: {
        type: String,
        enum: ['manual', 'google_fit', 'apple_health', 'fitbit'],
        default: 'manual'
      }
    }]
  },
  
  water: {
    glasses: {
      type: Number,
      default: 0,
      min: 0
    },
    goal: {
      type: Number,
      default: 8
    },
    entries: [{
      glasses: Number,
      timestamp: {
        type: Date,
        default: Date.now
      },
      notes: String
    }]
  },
  
  sleep: {
    hours: {
      type: Number,
      default: 0,
      min: 0,
      max: 24
    },
    quality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    },
    bedtime: Date,
    wakeTime: Date,
    notes: String
  },
  
  // Meals & Nutrition
  meals: [{
    type: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true
    },
    time: {
      type: Date,
      required: true
    },
    foods: [{
      name: {
        type: String,
        required: true
      },
      quantity: {
        amount: Number,
        unit: String // grams, cups, pieces, etc.
      },
      calories: Number,
      nutrients: {
        protein: Number, // grams
        carbs: Number,   // grams
        fat: Number,     // grams
        fiber: Number,   // grams
        sugar: Number    // grams
      },
      isIndianFood: {
        type: Boolean,
        default: true
      },
      region: String, // North Indian, South Indian, etc.
      isHomemade: {
        type: Boolean,
        default: true
      }
    }],
    totalCalories: {
      type: Number,
      default: 0
    },
    mealRating: {
      type: Number,
      min: 1,
      max: 5
    },
    photo: String, // URL to meal photo
    notes: String
  }],
  
  // Exercise & Activities
  exercises: [{
    type: {
      type: String,
      enum: ['yoga', 'walking', 'running', 'gym', 'cycling', 'swimming', 'dancing', 'sports', 'strength_training', 'cardio', 'other'],
      required: true
    },
    name: String, // Specific exercise name
    duration: {
      type: Number, // in minutes
      required: true
    },
    intensity: {
      type: String,
      enum: ['light', 'moderate', 'vigorous'],
      default: 'moderate'
    },
    caloriesBurned: Number,
    startTime: Date,
    endTime: Date,
    location: String, // gym, home, park, etc.
    equipment: [String], // dumbbells, treadmill, etc.
    notes: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  
  // Weight & Body Measurements
  measurements: {
    weight: {
      value: Number, // in kg
      timestamp: Date
    },
    bodyFat: Number, // percentage
    muscleMass: Number, // in kg
    waist: Number, // in cm
    chest: Number, // in cm
    arms: Number, // in cm
    thighs: Number // in cm
  },
  
  // Health Vitals
  vitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      timestamp: Date
    },
    heartRate: {
      resting: Number,
      max: Number,
      timestamp: Date
    },
    bloodSugar: {
      fasting: Number,
      postMeal: Number,
      timestamp: Date
    },
    temperature: {
      value: Number, // in Celsius
      timestamp: Date
    }
  },
  
  // Mood & Wellness
  mood: {
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    emotions: [{
      type: String,
      enum: ['happy', 'sad', 'anxious', 'stressed', 'energetic', 'tired', 'confident', 'motivated']
    }],
    stressLevel: {
      type: Number,
      min: 1,
      max: 10
    },
    notes: String
  },
  
  // Symptoms & Health Issues
  symptoms: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    duration: String, // "2 hours", "1 day", etc.
    notes: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Medications
  medications: [{
    name: String,
    dosage: String,
    timeTaken: Date,
    notes: String
  }],
  
  // Daily Summary
  summary: {
    totalCalories: {
      consumed: {
        type: Number,
        default: 0
      },
      burned: {
        type: Number,
        default: 0
      },
      net: {
        type: Number,
        default: 0
      }
    },
    totalExerciseMinutes: {
      type: Number,
      default: 0
    },
    goalsAchieved: {
      steps: Boolean,
      water: Boolean,
      sleep: Boolean,
      exercise: Boolean,
      calories: Boolean
    },
    overallRating: {
      type: Number,
      min: 1,
      max: 5
    },
    notes: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
healthLogSchema.index({ userId: 1, date: -1 });
healthLogSchema.index({ userId: 1, 'meals.time': -1 });
healthLogSchema.index({ userId: 1, 'exercises.startTime': -1 });

// Virtual for BMI calculation
healthLogSchema.virtual('currentBMI').get(function() {
  if (this.measurements && this.measurements.weight) {
    // Get user height from User model (would need to populate)
    // For now, return null - BMI should be calculated at application level
    return null;
  }
  return null;
});

// Method to calculate total calories consumed
healthLogSchema.methods.getTotalCaloriesConsumed = function() {
  return this.meals.reduce((total, meal) => total + (meal.totalCalories || 0), 0);
};

// Method to calculate total calories burned
healthLogSchema.methods.getTotalCaloriesBurned = function() {
  return this.exercises.reduce((total, exercise) => total + (exercise.caloriesBurned || 0), 0);
};

// Method to check if goals are achieved
healthLogSchema.methods.updateGoalStatus = function() {
  this.summary.goalsAchieved = {
    steps: this.steps.count >= this.steps.goal,
    water: this.water.glasses >= this.water.goal,
    sleep: this.sleep.hours >= 7, // Minimum recommended sleep
    exercise: this.summary.totalExerciseMinutes >= 30, // Minimum recommended exercise
    calories: Math.abs(this.summary.totalCalories.net) <= 200 // Within 200 calories of balance
  };
};

// Pre-save middleware to calculate summaries
healthLogSchema.pre('save', function(next) {
  // Calculate total calories
  this.summary.totalCalories.consumed = this.getTotalCaloriesConsumed();
  this.summary.totalCalories.burned = this.getTotalCaloriesBurned();
  this.summary.totalCalories.net = this.summary.totalCalories.consumed - this.summary.totalCalories.burned;
  
  // Calculate total exercise minutes
  this.summary.totalExerciseMinutes = this.exercises.reduce((total, exercise) => total + exercise.duration, 0);
  
  // Update goal achievement status
  this.updateGoalStatus();
  
  next();
});

module.exports = mongoose.model('HealthLog', healthLogSchema);