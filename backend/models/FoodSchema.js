const mongoose = require("mongoose");

// Warning! Enforced schema...
const FoodSchema = new mongoose.Schema({
  title: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now }, // Automatically set current date
  description: { type: String, default: "no description provided" }, // Default description
  status: { 
    type: String, 
    enum: ["On Refrigerator" ,"Approved","Rejected", "Pending", "Expired", "Completed", "Submitted"], 
    default: "Submitted",
    required: true 
  },  // Status must be only one of these values used for analysis...
  location: {
    latitude: { type: Number, required: true }, // Latitude value for loc
    longitude: { type: Number, required: true } // Longitude value for loc
  },
  deliveryDate: { type: Date },
  foodLifeTime: { type: Number, default: 24 }, 
  images: [
    {
      id: { type: Number },
      source: { type: String },
      //can be many images up to 5
    }
  ]
});

module.exports = mongoose.model("FoodDelivery", FoodSchema);
