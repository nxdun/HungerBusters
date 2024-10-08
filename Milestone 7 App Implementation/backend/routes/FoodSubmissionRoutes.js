const express = require("express");
const FoodSch = require("../models/FoodSchema"); // Assuming models are in models folder
const router = express.Router();
const commonerrmsg = "Error retrieving Data, Please Submit a Support request if issue presists"
// Helper function for validating FoodSch body
const validateFoodSchBody = (body) => {
  const { title, status, location, latitude, longitude, foodLifeTime } = body;

  if (!title || typeof title !== "string") {
    return { valid: false, message: "Title is required and must be a string." };
  }

  if (!status || !["On Refrigerator", "Pending", "Expired", "Completed", "Submitted"].includes(status)) {
    return { valid: false, message: "Status is invalid. Choose a valid status." };
  }

  if (!location || typeof location.latitude !== "number" || typeof location.longitude !== "number") {
    return { valid: false, message: "Location must include valid latitude and longitude values." };
  }

  if (foodLifeTime && typeof foodLifeTime !== "number") {
    return { valid: false, message: "Food life time must be a number." };
  }

  //if image count is more than 5 don't allow
  if (body.images && body.images.length > 5) {
    return { valid: false, message: "Only, Maximum 5 images are allowed." };
  }

  //minimum 1 image is required
  if (!body.images || body.images.length < 1) {
    return { valid: false, message: "At least one image is required." };
  }

  return { valid: true };
};

// GET all FoodSchs
// @route   GET /FoodSchs
// @desc    Get all food FoodSchs
router.get("/get", async (req, res) => {
  try {
    //about lean: add -_id to exclude _id from response
    //            add +field to include field in response
    //
    //much preformant improvement than retriving all fields o(1) vs o(n)

    const FoodSchsr = await FoodSch.find().select("-__v").lean();;

    res.json(FoodSchsr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: commonerrmsg});
  }
});

// GET a single FoodSch by ID
// @route   GET /FoodSchs/:id
// @desc    Get a single food FoodSch by its ID
router.get("/get/:id", async (req, res) => {
  try {
    const FoodSch = await FoodSch.findById(req.params.id);
    if (!FoodSch) return res.status(404).json({ message: "FoodSch not found" });
    res.json(FoodSch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: commonerrmsg });
  }
});

// POST create a new FoodSch
// @route   POST /FoodSchs
// @desc    Create a new food FoodSch
router.post("/post", async (req, res) => {
  // Validate the incoming FoodSch body
  const validation = validateFoodSchBody(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const newFoodSch = new FoodSch({
    title: req.body.title,
    submissionDate: req.body.submissionDate || Date.now(), // Automatically set submission date to now if not provided
    description: req.body.description || "no description provided", // Default description
    status: req.body.status,
    location: {
      latitude: req.body.location.latitude,
      longitude: req.body.location.longitude,
    },
    deliveryDate: req.body.deliveryDate,
    foodLifeTime: req.body.foodLifeTime,
    images: req.body.images,
  });

  try {
    const savedFoodSch = await newFoodSch.save();
    res.status(201).json("saved successfully !");
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error saving data, Please Submit a Support request if issue presists" });
  }
});

// PUT update a FoodSch by ID
// @route   PUT /FoodSchs/:id
// @desc    Update an existing food FoodSch by its ID
router.put("/put/:id", async (req, res) => {
  // Validate the incoming FoodSch body
  const validation = validateFoodSchBody(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const updatedFoodSch = await FoodSch.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description || "no description provided",
        status: req.body.status,
        location: {
          latitude: req.body.location.latitude,
          longitude: req.body.location.longitude,
        },
        deliveryDate: req.body.deliveryDate,
        foodLifeTime: req.body.foodLifeTime,
        images: req.body.images,
      },
      { new: true, runValidators: true } // Return the updated document and enforce schema validations
    );
    
    if (!updatedFoodSch) return res.status(404).json({ message: "FoodSch not found" });
    res.json(updatedFoodSch);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error updating FoodSch, Please Submit a Support request if issue presists" });
  }
});

// DELETE a FoodSch by ID
// @route   DELETE /FoodSchs/:id
// @desc    Delete a food FoodSch by its ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedFoodSch = await FoodSch.findByIdAndDelete(req.params.id);
    if (!deletedFoodSch) return res.status(404).json({ message: "FoodSch not found" });
    res.json({ message: "FoodSch deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting FoodSch, Please Submit a Support request if issue presists" });
  }
});



module.exports = router;
