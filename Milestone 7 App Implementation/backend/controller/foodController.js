const Food = require('../models/Food');

// Add new food
exports.addFood = async (req, res) => {
  try {
    const { name, calories, fat, saturatedFat, cholesterol, sodium, potassium, totalCarbs, dietaryFiber, sugar, protein, vitamins, minerals } = req.body;

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
      vitamins,
      minerals
    });

    await newFood.save();
    res.status(201).json({ message: 'Food added successfully', food: newFood });
  } catch (error) {
    res.status(400).json({ message: 'Error adding food', error });
  }
};

// Get all foods
exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching foods', error });
  }
};

// Get single food by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food', error });
  }
};

// Update food by ID
exports.updateFood = async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) return res.status(404).json({ message: 'Food not found' });
    res.status(200).json({ message: 'Food updated successfully', food: updatedFood });
  } catch (error) {
    res.status(400).json({ message: 'Error updating food', error });
  }
};

// Delete food by ID
exports.deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Food not found' });
    res.status(200).json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting food', error });
  }
};
