import express from "express";
import { getOtherUsers, getUserData, login, logout, register, updateUserDetails } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
// router.route("/updateInterest").put(isAuthenticated, updateUserInterests);
router.route("/getUserDetails").get(isAuthenticated, getUserData);
router.route("/updateUserDetails").put(isAuthenticated, updateUserDetails);
router.route("/").get(isAuthenticated, getOtherUsers)

export default router;