const Food = require('../models/Food');

// Add new food
exports.addFood = async (req, res) => {
  try {
    const { name, calories, fat, saturatedFat, cholesterol, sodium, potassium, totalCarbs, dietaryFiber, sugar, protein } = req.body;
    const image = req.file.path; // Get the image path from the uploaded file

    const newFood = new Food({
      name,
      calories,
      fat,
      saturatedFat,
      cholesterol,
      sodium,
      potassium,
      totalCarbs,
      dietaryFiber,
      sugar,
      protein,
      image,
    });

    await newFood.save();
    res.status(201).json({ message: 'Food added successfully', food: newFood });
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(400).json({ message: 'Error adding food', error: error.message });
  }
};

// Get all foods
exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find();

    // // Log the foods array to check if images are present
    // console.log('Fetched foods:', foods);

    // Include the full URL for the images with added checks
    const foodsWithImageUrl = foods.map(food => {
      // Ensure the image path exists and is a valid string
      const imagePath = food.image || '';
      const fullImageUrl = imagePath ? `${imagePath}` : null; // Create full image URL

      return {
        ...food.toObject(), // Convert Mongoose document to plain object
        image: fullImageUrl, // Set image URL or null if image is not present
      };
    });

    res.status(200).json(foodsWithImageUrl);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ message: 'Error fetching foods', error });
  }
};


// Get single food by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    // Construct the full image URL if the image path exists
    const imagePath = food.image || '';
    const fullImageUrl = imagePath ? `${imagePath}` : null; // Create full image URL

    // Return the food object with the full image URL
    res.status(200).json({
      ...food.toObject(), // Convert Mongoose document to plain object
      image: fullImageUrl, // Include the image URL
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food', error: error.message });
  }
};


// Update food by ID
exports.updateFood = async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.file) {
      updatedData.image = req.file.path; // Update image if provided
    }

    const updatedFood = await Food.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedFood) return res.status(404).json({ message: 'Food not found' });
    res.status(200).json({ message: 'Food updated successfully', food: updatedFood });
  } catch (error) {
    res.status(400).json({ message: 'Error updating food', error: error.message });
  }
};

// Delete food by ID
exports.deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Food not found' });
    res.status(200).json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting food', error: error.message });
  }
};
