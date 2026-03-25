const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { signup, login, googleLogin, getMe, updateProfile, changePassword } = require("../controllers/authController");

// Wrap upload so errors don't crash the request
const uploadAvatar = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) { req.file = null; }
    next();
  });
};

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", protect, getMe);
router.put("/profile", protect, uploadAvatar, updateProfile);
router.put("/password", protect, changePassword);

module.exports = router;
