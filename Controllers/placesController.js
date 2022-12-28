const Place = require("../Models/places");
const geoCoder = require("../Utils/geocoder");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFilters = require("../Utils/apiFilters");

//  Get All Jobs => /api/v1/places
// remember there is request.query and request.params
exports.getPlaces = catchAsyncErrors(async (req, res, next) => {
  const apiFilters = new APIFilters(Place.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .searchByQuery()
    .pagination();
  const places = await apiFilters.query;

  res.status(200).json({
    success: true,
    method: req.requestMethod,
    results: places.length,
    data: places,
  });
});

// Create a new place  => /api/v1/place/new
// For multiple places do a foreEach loop
exports.newPlace = catchAsyncErrors(async (req, res, next) => {
  const place = await Place.create(req.body);

  res.status(200).json({
    success: true,
    message: "Place Created",
    data: place,
  });
});

exports.newPlaces = catchAsyncErrors(async (req, res, next) => {
  // get the array
  const listofPalces = req.body;

  await listofPalces.forEach((place) => {
    Place.create(place);
  });

  // const place = await Place.create(req.body);

  console.log("The list of places!");

  res.status(200).json({
    success: true,
    message: "Place Created",
    data: listofPalces,
  });
});

exports.getPlacesInRadius = catchAsyncErrors(async (req, res, next) => {
  const distance = req.params.radius;
  const code = req.params.code;

  // Getting latitude and longitude from geoCoder with zipcode
  // console.log("lets figure this out");
  // console.log(zipcode);
  // console.log(distance);
  const loc = await geoCoder.geocode(code);
  const latitude = loc[0].latitude;
  const longitude = loc[0].longitude;
  // radius of the earth in miles
  const radius = distance / 3963;

  const places = await Place.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    success: true,
    radius: distance,
    data: places,
  });
});

exports.getPlace = catchAsyncErrors(async (req, res, next) => {
  console.log("balls");
  console.log(req.params);
  const place = await Place.find({
    $and: [{ _id: req.params.id }, { slug: req.params.slug }],
  });

  if (!place || place.length === 0) {
    return next(new ErrorHandler("Place was not found", 404));
  }

  res.status(200).json({
    success: true,
    data: place,
  });
});
