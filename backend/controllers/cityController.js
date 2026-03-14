import City from "../models/City.js";
import asyncHandler from "express-async-handler";

// @desc    Get all active cities
// @route   GET /api/cities
// @access  Public
export const getCities = asyncHandler(async (req, res) => {
  const cities = await City.find({ isAvailable: true }).sort({ name: 1 });
  res.json(cities);
});

// @desc    Add a new city
// @route   POST /api/cities
// @access  Private/Admin
export const addCity = asyncHandler(async (req, res) => {
  const { name, state } = req.body;

  const cityExists = await City.findOne({ name });

  if (cityExists) {
    res.status(400);
    throw new Error("City already exists");
  }

  const city = await City.create({
    name,
    state,
  });

  if (city) {
    res.status(201).json(city);
  } else {
    res.status(400);
    throw new Error("Invalid city data");
  }
});

// @desc    Update city status
// @route   PUT /api/cities/:id
// @access  Private/Admin
export const updateCity = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id);

  if (city) {
    city.isAvailable = req.body.isAvailable ?? city.isAvailable;
    const updatedCity = await city.save();
    res.json(updatedCity);
  } else {
    res.status(404);
    throw new Error("City not found");
  }
});

// @desc    Delete a city
// @route   DELETE /api/cities/:id
// @access  Private/Admin
export const deleteCity = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id);

  if (city) {
    await city.deleteOne();
    res.json({ message: "City removed" });
  } else {
    res.status(404);
    throw new Error("City not found");
  }
});
