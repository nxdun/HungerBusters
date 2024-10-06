const mongoose = require('mongoose');

// Define the Food Schema
const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  saturatedFat: {
    type: Number,
    required: true
  },
  cholesterol: {
    type: Number,
    required: true
  },
  sodium: {
    type: Number,
    required: true
  },
  potassium: {
    type: Number,
    required: true
  },
  totalCarbs: {
    type: Number,
    required: true
  },
  dietaryFiber: {
    type: Number,
    required: true
  },
  sugar: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  vitamins: {
    vitaminC: Number,
    vitaminD: Number,
    vitaminB6: Number,
    cobalamin: Number
  },
  minerals: {
    calcium: Number,
    iron: Number,
    magnesium: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Food', FoodSchema);
