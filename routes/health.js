const express = require('express');
const HealthLog = require('../models/HealthLog');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/health/today
// @desc    Get today's health data
// @access  Private
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let healthLog = await HealthLog.findOne({
      userId: req.user.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!healthLog) {
      // Create new health log for today
      healthLog = new HealthLog({
        userId: req.user.userId,
        date: today
      });
      await healthLog.save();
    }

    res.json({
      success: true,
      data: healthLog
    });

  } catch (error) {
    console.error('Get today health data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/health/steps
// @desc    Log steps
// @access  Private
router.post('/steps', auth, [
  body('count').isInt({ min: 0 }).withMessage('Steps count must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { count, source = 'manual' } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let healthLog = await HealthLog.findOne({
      userId: req.user.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!healthLog) {
      healthLog = new HealthLog({
        userId: req.user.userId,
        date: today
      });
    }

    // Add new steps entry
    healthLog.steps.entries.push({
      count,
      source,
      timestamp: new Date()
    });

    // Update total steps
    healthLog.steps.count += count;

    await healthLog.save();

    res.json({
      success: true,
      message: 'Steps logged successfully',
      data: {
        totalSteps: healthLog.steps.count,
        goalAchieved: healthLog.steps.count >= healthLog.steps.goal
      }
    });

  } catch (error) {
    console.error('Log steps error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/health/water
// @desc    Log water intake
// @access  Private
router.post('/water', auth, [
  body('glasses').isInt({ min: 1, max: 5 }).withMessage('Glasses must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { glasses, notes } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let healthLog = await HealthLog.findOne({
      userId: req.user.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!healthLog) {
      healthLog = new HealthLog({
        userId: req.user.userId,
        date: today
      });
    }

    // Add new water entry
    healthLog.water.entries.push({
      glasses,
      notes,
      timestamp: new Date()
    });

    // Update total water intake
    healthLog.water.glasses += glasses;

    await healthLog.save();

    res.json({
      success: true,
      message: 'Water intake logged successfully',
      data: {
        totalGlasses: healthLog.water.glasses,
        goalAchieved: healthLog.water.glasses >= healthLog.water.goal
      }
    });

  } catch (error) {
    console.error('Log water error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/health/meal
// @desc    Log meal
// @access  Private
router.post('/meal', auth, [
  body('type').isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Invalid meal type'),
  body('foods').isArray({ min: 1 }).withMessage('At least one food item is required'),
  body('foods.*.name').notEmpty().withMessage('Food name is required'),
  body('foods.*.calories').isNumeric().withMessage('Calories must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type, foods, notes, mealRating } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let healthLog = await HealthLog.findOne({
      userId: req.user.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!healthLog) {
      healthLog = new HealthLog({
        userId: req.user.userId,
        date: today
      });
    }

    // Calculate total calories for this meal
    const totalCalories = foods.reduce((sum, food) => sum + (food.calories || 0), 0);

    // Add new meal
    healthLog.meals.push({
      type,
      time: new Date(),
      foods,
      totalCalories,
      mealRating,
      notes
    });

    await healthLog.save();

    res.json({
      success: true,
      message: 'Meal logged successfully',
      data: {
        mealCalories: totalCalories,
        totalDailyCalories: healthLog.getTotalCaloriesConsumed()
      }
    });

  } catch (error) {
    console.error('Log meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/health/exercise
// @desc    Log exercise
// @access  Private
router.post('/exercise', auth, [
  body('type').isIn(['yoga', 'walking', 'running', 'gym', 'cycling', 'swimming', 'dancing', 'sports', 'strength_training', 'cardio', 'other']).withMessage('Invalid exercise type'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
  body('intensity').isIn(['light', 'moderate', 'vigorous']).withMessage('Invalid intensity level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      type, 
      name, 
      duration, 
      intensity = 'moderate', 
      caloriesBurned, 
      location, 
      equipment, 
      notes, 
      rating 
    } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let healthLog = await HealthLog.findOne({
      userId: req.user.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!healthLog) {
      healthLog = new HealthLog({
        userId: req.user.userId,
        date: today
      });
    }

    // Calculate calories burned if not provided
    let calculatedCalories = caloriesBurned;
    if (!calculatedCalories) {
      // Basic calculation based on exercise type and duration
      const calorieRates = {
        yoga: { light: 2, moderate: 3, vigorous: 4 },
        walking: { light: 3, moderate: 4, vigorous: 5 },
        running: { light: 6, moderate: 8, vigorous: 12 },
        gym: { light: 4, moderate: 6, vigorous: 8 },
        cycling: { light: 4, moderate: 6, vigorous: 10 },
        swimming: { light: 5, moderate: 7, vigorous: 11 },
        dancing: { light: 3, moderate: 5, vigorous: 7 }
      };

      const rate = calorieRates[type]?.[intensity] || 4;
      calculatedCalories = Math.round(rate * duration);
    }

    // Add new exercise
    healthLog.exercises.push({
      type,
      name,
      duration,
      intensity,
      caloriesBurned: calculatedCalories,
      startTime: new Date(),
      location,
      equipment,
      notes,
      rating
    });

    await healthLog.save();

    res.json({
      success: true,
      message: 'Exercise logged successfully',
      data: {
        caloriesBurned: calculatedCalories,
        totalExerciseMinutes: healthLog.summary.totalExerciseMinutes
      }
    });

  } catch (error) {
    console.error('Log exercise error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/health/sleep
// @desc    Log sleep
// @access  Private
router.post('/sleep', auth, [
  body('hours').isFloat({ min: 0, max: 24 }).withMessage('Sleep hours must be between 0 and 24'),
  body('quality').optional().isIn(['poor', 'fair', 'good', 'excellent']).withMessage('Invalid sleep quality')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { hours, quality, bedtime, wakeTime, notes } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let healthLog = await HealthLog.findOne({
      userId: req.user.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!healthLog) {
      healthLog = new HealthLog({
        userId: req.user.userId,
        date: today
      });
    }

    // Update sleep data
    healthLog.sleep = {
      hours,
      quality,
      bedtime: bedtime ? new Date(bedtime) : null,
      wakeTime: wakeTime ? new Date(wakeTime) : null,
      notes
    };

    await healthLog.save();

    res.json({
      success: true,
      message: 'Sleep logged successfully',
      data: {
        sleepHours: hours,
        sleepQuality: quality
      }
    });

  } catch (error) {
    console.error('Log sleep error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/health/history/:days
// @desc    Get health history for specified days
// @access  Private
router.get('/history/:days', auth, async (req, res) => {
  try {
    const days = parseInt(req.params.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const healthLogs = await HealthLog.find({
      userId: req.user.userId,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: healthLogs
    });

  } catch (error) {
    console.error('Get health history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/health/indian-foods
// @desc    Get Indian food database
// @access  Private
router.get('/indian-foods', auth, async (req, res) => {
  try {
    // Mock Indian food database
    const indianFoods = [
      // Staples
      { name: 'Roti (Chapati)', calories: 104, category: 'staple', region: 'North Indian', isVeg: true },
      { name: 'Rice (1 cup cooked)', calories: 205, category: 'staple', region: 'All India', isVeg: true },
      { name: 'Naan', calories: 262, category: 'bread', region: 'North Indian', isVeg: true },
      
      // Dal (Lentils)
      { name: 'Dal Tadka', calories: 184, category: 'dal', region: 'All India', isVeg: true },
      { name: 'Rajma', calories: 245, category: 'dal', region: 'North Indian', isVeg: true },
      { name: 'Chana Masala', calories: 269, category: 'dal', region: 'North Indian', isVeg: true },
      
      // Vegetables
      { name: 'Aloo Gobi', calories: 158, category: 'vegetable', region: 'North Indian', isVeg: true },
      { name: 'Palak Paneer', calories: 287, category: 'vegetable', region: 'North Indian', isVeg: true },
      { name: 'Bhindi Masala', calories: 89, category: 'vegetable', region: 'All India', isVeg: true },
      
      // South Indian
      { name: 'Idli (2 pieces)', calories: 58, category: 'breakfast', region: 'South Indian', isVeg: true },
      { name: 'Dosa (Plain)', calories: 168, category: 'breakfast', region: 'South Indian', isVeg: true },
      { name: 'Upma', calories: 251, category: 'breakfast', region: 'South Indian', isVeg: true },
      { name: 'Sambar', calories: 74, category: 'curry', region: 'South Indian', isVeg: true },
      
      // Snacks
      { name: 'Samosa', calories: 252, category: 'snack', region: 'North Indian', isVeg: true },
      { name: 'Pakora (5 pieces)', calories: 205, category: 'snack', region: 'All India', isVeg: true },
      { name: 'Dhokla (2 pieces)', calories: 160, category: 'snack', region: 'Gujarati', isVeg: true }
    ];

    res.json({
      success: true,
      data: indianFoods
    });

  } catch (error) {
    console.error('Get Indian foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;