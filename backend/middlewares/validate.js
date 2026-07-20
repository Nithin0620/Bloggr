const { body, param, validationResult } = require("express-validator");

// Shared: return 400 with first validation error
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const mongoId = (field) =>
  param(field).isMongoId().withMessage(`Invalid ${field}`);

const email = body("email")
  .isEmail().withMessage("Valid email is required")
  .normalizeEmail();

const password = body("password")
  .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  .trim();

// ─── Auth ────────────────────────────────────────────────
exports.signupValidation = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  email,
  password,
  body("confirmPassword").custom((val, { req }) => {
    if (val !== req.body.password) throw new Error("Passwords do not match");
    return true;
  }),
  body("agreetermsofservice").equals("true").withMessage("You must agree to terms"),
  body("otp").isLength({ min: 6, max: 6 }).isNumeric().withMessage("OTP must be 6 digits"),
  handleValidation,
];

exports.loginValidation = [
  email,
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

exports.sendOtpValidation = [
  email,
  handleValidation,
];

exports.sendResetOtpValidation = [
  email,
  handleValidation,
];

exports.verifyResetOtpValidation = [
  email,
  body("otp").isLength({ min: 6, max: 6 }).isNumeric().withMessage("OTP must be 6 digits"),
  handleValidation,
];

exports.resetPasswordValidation = [
  email,
  body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("confirmPassword").custom((val, { req }) => {
    if (val !== req.body.newPassword) throw new Error("Passwords do not match");
    return true;
  }),
  handleValidation,
];

// ─── Post ────────────────────────────────────────────────
exports.createPostValidation = [
  body("title").trim().notEmpty().withMessage("Title is required")
    .isLength({ max: 200 }).withMessage("Title must be under 200 characters"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("readTime").trim().notEmpty().withMessage("Read time is required"),
  body("categories").custom((val) => {
    const arr = Array.isArray(val) ? val : [val];
    if (arr.length === 0) throw new Error("At least one category is required");
    return true;
  }),
  handleValidation,
];

exports.updatePostValidation = [
  mongoId("id"),
  body("title").optional().trim().isLength({ min: 1, max: 200 }).withMessage("Title must be 1-200 characters"),
  body("content").optional().trim().notEmpty().withMessage("Content cannot be empty"),
  handleValidation,
];

exports.mongoIdParamValidation = (field) => [
  mongoId(field),
  handleValidation,
];

// ─── Comment ─────────────────────────────────────────────
exports.addCommentValidation = [
  mongoId("id"),
  body("text").trim().notEmpty().withMessage("Comment text is required")
    .isLength({ max: 1000 }).withMessage("Comment must be under 1000 characters"),
  handleValidation,
];

exports.deleteCommentValidation = [
  mongoId("postid"),
  mongoId("commentid"),
  handleValidation,
];

// ─── Profile ─────────────────────────────────────────────
exports.updateProfileValidation = [
  body("firstName").optional().trim().notEmpty().withMessage("First name cannot be empty"),
  body("lastName").optional().trim().notEmpty().withMessage("Last name cannot be empty"),
  body("bio").optional().trim().isLength({ max: 500 }).withMessage("Bio must be under 500 characters"),
  handleValidation,
];

// ─── Settings ────────────────────────────────────────────
exports.setSettingsValidation = [
  body("mode").optional().isIn(["Dark", "Light", "System"]).withMessage("Mode must be Dark, Light, or System"),
  body("theme").optional().isIn(["Green", "Blue", "Red", "Black", "Beige", "Yellow"]).withMessage("Invalid theme"),
  body("pushNotification").optional().isBoolean().withMessage("Push notification must be boolean"),
  body("emailNotification").optional().isBoolean().withMessage("Email notification must be boolean"),
  handleValidation,
];

// ─── Reading List ────────────────────────────────────────
exports.createReadingListValidation = [
  body("name").trim().notEmpty().withMessage("List name is required")
    .isLength({ max: 100 }).withMessage("Name must be under 100 characters"),
  body("description").optional().trim().isLength({ max: 500 }).withMessage("Description must be under 500 characters"),
  handleValidation,
];

exports.updateReadingListValidation = [
  mongoId("id"),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty")
    .isLength({ max: 100 }).withMessage("Name must be under 100 characters"),
  body("description").optional().trim().isLength({ max: 500 }).withMessage("Description must be under 500 characters"),
  handleValidation,
];

// ─── Tag ─────────────────────────────────────────────────
exports.createTagValidation = [
  body("name").trim().notEmpty().withMessage("Tag name is required")
    .isLength({ max: 50 }).withMessage("Tag name must be under 50 characters"),
  handleValidation,
];

// ─── Message ─────────────────────────────────────────────
exports.sendMessageValidation = [
  mongoId("id"),
  body("text").optional().trim().isLength({ max: 2000 }).withMessage("Message must be under 2000 characters"),
  handleValidation,
];

// ─── Category ────────────────────────────────────────────
exports.createCategoryValidation = [
  body("categoryName").trim().notEmpty().withMessage("Category name is required")
    .isLength({ max: 50 }).withMessage("Category must be under 50 characters"),
  handleValidation,
];
