import asyncHandler from "express-async-handler";
import Setting from "../models/Setting.js";

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find({});
  res.status(200).json(settings);
});

// @desc    Get a single setting by key
// @route   GET /api/settings/:key
// @access  Private
export const getSettingByKey = asyncHandler(async (req, res) => {
  const setting = await Setting.findOne({ key: req.params.key });
  
  if (!setting) {
    if (req.params.key === "platformCommissionPercentage") {
      return res.status(200).json({ key: req.params.key, value: 15 });
    }
    res.status(404);
    throw new Error("Setting not found");
  }
  res.status(200).json(setting);
});

// @desc    Create or update a setting
// @route   POST /api/settings
// @access  Private/Admin
export const updateSetting = asyncHandler(async (req, res) => {
  const { key, value, description } = req.body;

  let setting = await Setting.findOne({ key });

  if (setting) {
    setting.value = value;
    if (description) setting.description = description;
    setting.updatedBy = req.user._id;
    await setting.save();
  } else {
    setting = await Setting.create({
      key,
      value,
      description,
      updatedBy: req.user._id,
    });
  }

  res.status(200).json(setting);
});
