const express = require("express");
const router = express.Router();

// Importing the jobs controller methods

const {
  getPlaces,
  newPlace,
  newPlaces,
  getPlace,
  getPlacesInRadius,
  getPlacesWithinRadiusAndZipcode,
} = require("../Controllers/placesController");

router.route("/places").get(getPlaces);
router.route("/place/:id/:slug").get(getPlace);
router.route("/places/locationsearch/:code/:radius").get(getPlacesInRadius);


// ignore
router.route("/place/new").post(newPlace);
router.route("/places/new").post(newPlaces);

// router.route("/job/:id").put(updateJob);

// router.route("/job/:id").delete(deleteJob);

module.exports = router;
