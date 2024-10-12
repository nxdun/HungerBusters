const express = require('express');
const router = express.Router();
const recipeController = require('../controller/recipeController');
const upload = require('../middlewares/upload'); 

// Add a new recipe
router.post('/add', upload.single('image'), recipeController.addRecipe);

// Get all recipes
router.get('/', recipeController.getRecipes);

// Get a single recipe by ID
router.get('/:id', recipeController.getRecipeById);

// Update recipe by ID
router.put('/update/:id', upload.single('image'), recipeController.updateRecipe);

// Delete recipe by ID
router.delete('/delete/:id', recipeController.deleteRecipe);

module.exports = router;
