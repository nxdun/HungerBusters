const express = require('express');
const router = express.Router();
const foodController = require('../controller/foodController');

// Add a new food
router.post('/add', foodController.addFood);

// Get all foods
router.get('/', foodController.getFoods);

// Get a single food by ID
router.get('/:id', foodController.getFoodById);

// Update food by ID
router.put('/update/:id', foodController.updateFood);

// Delete food by ID
router.delete('/delete/:id', foodController.deleteFood);

module.exports = router;
