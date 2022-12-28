const mongoose = require("mongoose");
const slugify = require("slugify");
const geoCoder = require("../Utils/geocoder");

const placeSchema = new mongoose.Schema({
  placename: {
    type: String,
    required: [true, "Please enter place name"],
    trim: true,
    maxlength: [100, "Cannot exceed 100 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please enter a description."],
    maxlength: [10000, "Description cannot exceed 1000 characters"],
  },

  contactNumber: {
    type: String,
    trim: true,
  },
  averageRating: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: { type: String, trim: true },
    country: String,
  },
  googleMapsLink: {
    type: String,
    trim: true,
  },

  category: {
    type: String,
    required: [true, "Please enter relevant categories"],
  },
  priceRange: {
    type: [String],
    required: [true, "Please enter price range"],
    enum: {
      values: ["£", "££", "£££"],
    },
    message: "Please select a price range",
  },
  openingHours: {
    type: String,
    required: [true, "Please enter hours"],
  },
  featuredImage: {
    type: String,
  },
  website: {
    type: String,
  },
});

// Creating Job Slug before saving
placeSchema.pre("save", function (next) {
  // Creating slug before saving to DB
  this.slug = slugify(this.placename, { lower: true });
  next();
});

// Setting up location

placeSchema.pre("save", async function (next) {
  const loc = await geoCoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
});

module.exports = mongoose.model("Place", placeSchema);
