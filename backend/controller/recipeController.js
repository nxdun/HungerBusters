const Recipe = require('../models/Recipe');

// Add a new recipe
exports.addRecipe = async (req, res) => {
  try {
    const { title, prepTime, cookTime, difficulty, servings, description, nutrition, ingredients, method, videoLink } = req.body;
    const image = req.file.path;

    const newRecipe = new Recipe({
      title,
      prepTime,
      cookTime,
      difficulty,
      servings,
      description,
      nutrition,
      ingredients,
      method,
      videoLink,
      image
    });

    await newRecipe.save();
    res.status(201).json({ message: 'Recipe added successfully', recipe: newRecipe });
  } catch (error) {
    res.status(400).json({ message: 'Error adding recipe', error });
  }
};

// Get all recipes
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();

    // Include the full URL for the images with added checks
    const recipesWithImageUrl = recipes.map(recipe => {
      // Ensure the image path exists and is a valid string
      const imagePath = recipe.image || ''; // Correctly reference recipe.image
      const fullImageUrl = imagePath ? `${imagePath}` : null; // Create full image URL

      return {
        ...recipe.toObject(), // Convert Mongoose document to plain object
        image: fullImageUrl, // Set image URL or null if image is not present
      };
    });

    res.status(200).json(recipesWithImageUrl);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
};


// Get single recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

      const imagePath = recipe.image || ''; // Define this correctly
      const fullImageUrl = imagePath ? `${imagePath}` : null; // Create full image URL

      res.status(200).json({
          ...recipe.toObject(), // Convert Mongoose document to plain object
          image: fullImageUrl, // Include the image URL
      });
  } catch (error) {
      console.error("Error fetching recipe by ID:", error); // Add error logging
      res.status(500).json({ message: 'Error fetching recipe', error });
  }
};

  

// Update recipe by ID
exports.updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    res.status(400).json({ message: 'Error updating recipe', error });
  }
};

// Delete recipe by ID
exports.deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error });
  }
};
