const mongoose = require('mongoose');

// Define the Recipe Schema
const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  prepTime: {
    type: String,  // e.g., "5 mins"
    required: true
  },
  cookTime: {
    type: String,  // e.g., "45 mins"
    required: true
  },
  difficulty: {
    type: String,  // e.g., "Easy"
    required: true
  },
  servings: {
    type: Number,  // e.g., 4
    required: true
  },
  description: {
    type: String,  // e.g., "This is a family dinner recipe..."
    required: true
  },
  nutrition: {
    kcal: Number,
    fat: Number,
    saturates: Number,
    carbs: Number,
    sugars: Number,
    fibre: Number,
    protein: Number,
    salt: Number
  },
  ingredients: {
    type: [String], // Array of ingredients (e.g., "2 tbsp sunflower oil")
    required: true
  },
  method: {
    type: [String], // Array of steps (e.g., "STEP 1: Heat the oil...")
    required: true
  },
  videoLink: {
    type: String // YouTube video link (optional)
  },
  image: { // New field for the food image URL
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
