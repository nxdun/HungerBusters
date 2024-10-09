const express = require("express");
const FoodSch = require("../models/FoodSchema"); // Assuming models are in models folder
const router = express.Router();

// REUSABLE THINGS-------------------------------------------------------------------------------------------------
const commonerrmsg = "Error retrieving Data, Please Submit a Support request if issue persists";

// All in one Helper function for validating FoodSchema body
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

  if (body.images && body.images.length > 5) {
    return { valid: false, message: "Only, Maximum 5 images are allowed." };
  }

  if (!body.images || body.images.length < 1) {
    return { valid: false, message: "At least one image is required." };
  }

  return { valid: true };
};

// CRUD OPERATIONS-------------------------------------------------------------------------------------------------
// POST create a new FoodSch
// @route   POST /FoodSchs
// @desc    Create a new food FoodSch
router.post("/post", async (req, res) => {
  const validation = validateFoodSchBody(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const newFoodSch = new FoodSch({
    title: req.body.title,
    submissionDate: req.body.submissionDate || Date.now(),
    description: req.body.description || "no description provided",
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
    res.status(400).json({ message: "Error saving data, Please Submit a Support request if issue persists" });
  }
});

// PUT update a FoodSch by ID
// @route   PUT /FoodSchs/:id
// @desc    Update an existing food FoodSch by its ID
router.put("/put/:id", async (req, res) => {
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
      { new: true, runValidators: true }
    );

    if (!updatedFoodSch) return res.status(404).json({ message: "FoodSch not found" });
    res.json(updatedFoodSch);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error updating FoodSch, Please Submit a Support request if issue persists" });
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
    res.status(500).json({ message: "Error deleting FoodSch, Please Submit a Support request if issue persists" });
  }
});

// Advanced Operation-------------------------------------------------------------------------------------------------
// GET dashboard data
// @route   GET /api/fsr/dashboard-data
// @desc    Get summary data for dashboard
router.get("/get/dashboard-data", async (req, res) => {
  try {
    const total = await FoodSch.countDocuments();
    const approved = await FoodSch.countDocuments({ status: "Completed" });
    const expired = await FoodSch.countDocuments({ status: "Expired" });
    const pending = await FoodSch.countDocuments({ status: "Pending" });

    const tableData = await FoodSch.find()
    .select("submissionDate status deliveryDate")
    .sort({ submissionDate: -1 }) // Sort by submissionDate in descending order
    .limit(5) // Limited the result to the latest 5 entries
    .lean();  

    const formattedTableData = tableData.map((entry) => [
      entry.submissionDate.toISOString().split("T")[0],
      entry.status,
      entry.deliveryDate ? entry.deliveryDate.toISOString().split("T")[0] : "N/A",
      entry.status === "Pending" ? "Pending" : "Completed",
    ]);

    const pendingApprovals = await FoodSch.find({ status: "Pending" })
      .select("_id images description")
      .lean();

    const formattedPendingApprovals = pendingApprovals.map((entry, index) => ({
      id: index + 1,
      images: entry.images,
      description: entry.description || "No description",
    }));

    const response = {
      approved,
      total,
      expired,
      pending,
      tableData: formattedTableData,
      pendingApprovals: formattedPendingApprovals,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: commonerrmsg });
  }
});
//moved to bottom due to conflict with /get/:id-----------------------------------------------
// GET a single FoodSch by ID
// @route   GET /FoodSchs/:id
// @desc    Get a single food FoodSch by its ID
router.get("/get/:id", async (req, res) => {
  try {
    const foodSch = await FoodSch.findById(req.params.id).select("-__v").lean();
    if (!foodSch) return res.status(404).json({ message: "FoodSch not found" });
    res.json(foodSch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: commonerrmsg });
  }
});

module.exports = router;
