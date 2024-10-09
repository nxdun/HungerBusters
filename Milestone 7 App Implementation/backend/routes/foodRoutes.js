const express = require('express');
const router = express.Router();
const foodController = require('../controller/foodController');
const upload = require('../middlewares/upload'); 

// Add a new food with image
router.post('/add', upload.single('image'), foodController.addFood);

// Get all foods
router.get('/', foodController.getFoods);

// Get a single food by ID
router.get('/:id', foodController.getFoodById);

// Update food by ID
router.put('/update/:id', upload.single('image'), foodController.updateFood); // Include image upload for updates

// Delete food by ID
router.delete('/delete/:id', foodController.deleteFood);

module.exports = router;
