const express = require('express');
const router = express.Router();
const recipeController = require('../controller/recipeController');

// Add a new recipe
router.post('/add', recipeController.addRecipe);

// Get all recipes
router.get('/', recipeController.getRecipes);

// Get a single recipe by ID
router.get('/:id', recipeController.getRecipeById);

// Update recipe by ID
router.put('/update/:id', recipeController.updateRecipe);

// Delete recipe by ID
router.delete('/delete/:id', recipeController.deleteRecipe);

module.exports = router;
