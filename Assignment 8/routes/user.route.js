const express = require("express");
const router = express.Router();

//local imports
const {
  register,
  login,
  logout,
  getUser,
  updateUser,
  deleteUser,
  uploadAvatar,
} = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const upload = require("../middleware/fileUpload");

router.route("/signup").post(register);
router.route("/login").post(login);
router.route("/logout").post(auth, logout);

router
  .route("/me")
  .get(auth, getUser)
  .patch(auth, updateUser)
  .delete(auth, deleteUser);
router.route("/me/upload").post(auth, upload.single("file"), uploadAvatar);

module.exports = router;
