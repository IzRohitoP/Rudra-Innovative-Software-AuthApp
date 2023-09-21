const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPasswords,
  resetPassword,
  getUserDetails,
  getAllUsers,
  getOneUserDetail,
  updateProfile,
  updatePassword,
  updateUserRole,
  deleteUser,
} = require("../controller/userController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPasswords);
router.route("/password/reset/:token").patch(resetPassword);
router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/me/update").patch(isAuthenticated, updateProfile);
router.route("/me/password/update").patch(isAuthenticated, updatePassword);
router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getOneUserDetail)
  .patch(isAuthenticated, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);

module.exports = router;
