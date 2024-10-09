const mongoose = require('mongoose');

// Define the Food Schema
const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  saturatedFat: {
    type: Number,
    required: true,
  },
  cholesterol: {
    type: Number,
    required: true,
  },
  sodium: {
    type: Number,
    required: true,
  },
  potassium: {
    type: Number,
    required: true,
  },
  totalCarbs: {
    type: Number,
    required: true,
  },
  dietaryFiber: {
    type: Number,
    required: true,
  },
  sugar: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  vitamins: {
    vitaminC: {
      type: Number,
      default: 0,
    },
    vitaminD: {
      type: Number,
      default: 0,
    },
    vitaminB6: {
      type: Number,
      default: 0,
    },
    cobalamin: {
      type: Number,
      default: 0,
    },
  },
  minerals: {
    calcium: {
      type: Number,
      default: 0,
    },
    iron: {
      type: Number,
      default: 0,
    },
    magnesium: {
      type: Number,
      default: 0,
    },
  },
  image: { // New field for the food image URL
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Food', FoodSchema);
