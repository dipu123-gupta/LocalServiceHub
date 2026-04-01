import Category from "../models/Category.js";
import asyncHandler from "express-async-handler";
import logAction from "../utils/auditLogger.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const query = {};
  // If not admin, only show categories that are explicitly active OR missing the field (legacy)
  if (req.user?.role !== "admin") {
    query.isActive = { $ne: false };
  }
  const categories = await Category.find(query);
  res.json(categories);
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, image } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name,
    description,
    icon,
    image,
  });

  await logAction(
    req,
    "CREATE_CATEGORY",
    category._id,
    "Category",
    `Category "${category.name}" was created.`
  );

  res.status(201).json(category);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;
    category.icon = req.body.icon || category.icon;
    category.image = req.body.image || category.image;

    const updatedCategory = await category.save();

    await logAction(
      req,
      "UPDATE_CATEGORY",
      category._id,
      "Category",
      `Category "${category.name}" was updated.`
    );

    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    const categoryName = category.name;
    await category.deleteOne();

    await logAction(
      req,
      "DELETE_CATEGORY",
      req.params.id,
      "Category",
      `Category "${categoryName}" was removed.`
    );

    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Toggle category status
// @route   PUT /api/categories/:id/toggle
// @access  Private/Admin
const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    category.isActive = !category.isActive;
    await category.save();

    await logAction(
      req,
      "UPDATE_CATEGORY",
      category._id,
      "Category",
      `Category "${category.name}" status toggled to ${category.isActive ? "Active" : "Inactive"}.`
    );

    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};
