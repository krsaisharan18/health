const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  
  // Health Information
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  height: {
    type: Number, // in cm
    required: true,
    min: 100,
    max: 250
  },
  weight: {
    type: Number, // in kg
    required: true,
    min: 30,
    max: 300
  },
  dietaryPreference: {
    type: String,
    enum: ['vegetarian', 'vegan', 'non-vegetarian', 'eggetarian'],
    required: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  
  // Health Goals
  dailyStepsGoal: {
    type: Number,
    default: 10000
  },
  dailyWaterGoal: {
    type: Number,
    default: 8 // glasses
  },
  dailyCaloriesGoal: {
    type: Number,
    default: function() {
      // Basic BMR calculation for calorie goal
      const age = new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
      let bmr;
      
      if (this.gender === 'male') {
        bmr = 88.362 + (13.397 * this.weight) + (4.799 * this.height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * this.weight) + (3.098 * this.height) - (4.330 * age);
      }
      
      return Math.round(bmr * 1.5); // Moderate activity level
    }
  },
  sleepGoal: {
    type: Number,
    default: 8 // hours
  },
  
  // App Settings
  language: {
    type: String,
    enum: ['en', 'hi', 'ta', 'te', 'kn'],
    default: 'en'
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    waterReminder: {
      type: Boolean,
      default: true
    },
    exerciseReminder: {
      type: Boolean,
      default: true
    },
    sleepReminder: {
      type: Boolean,
      default: true
    }
  },
  
  // Medical Information (Optional)
  medicalConditions: [{
    type: String,
    trim: true
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  allergies: [{
    type: String,
    trim: true
  }],
  
  // Doctor/Trainer Assignment
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  assignedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  // Subscription
  subscriptionType: {
    type: String,
    enum: ['free', 'premium', 'family'],
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields
userSchema.virtual('age').get(function() {
  return new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
});

userSchema.virtual('bmi').get(function() {
  const heightInM = this.height / 100;
  return (this.weight / (heightInM * heightInM)).toFixed(1);
});

userSchema.virtual('bmiCategory').get(function() {
  const bmi = this.bmi;
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
});

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ city: 1 });
userSchema.index({ assignedDoctor: 1 });

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get safe user data (without password)
userSchema.methods.toSafeObject = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);