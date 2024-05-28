import express from "express";
import { getOtherUsers, getUserData, getUserDataById, login, logout, register, updateUserDetails, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, blockUser, searchUsers, unBlockUser } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
// router.route("/updateInterest").put(isAuthenticated, updateUserInterests);
router.route("/getUserDetails").get(isAuthenticated, getUserData);
router.route("/getUserDataById/:id").get(isAuthenticated, getUserDataById);
router.route("/updateUserDetails").put(isAuthenticated, updateUserDetails);
router.route("/").get(isAuthenticated, getOtherUsers);

// New routes for friend requests
// http://localhost:4000/api/v1/user/sendFriendRequest
router.route("/sendFriendRequest").post(isAuthenticated, sendFriendRequest);
router.route("/cancelFriendRequest").post(isAuthenticated, cancelFriendRequest);
router.route("/acceptFriendRequest").post(isAuthenticated, acceptFriendRequest);
router.route("/blockUser").post(isAuthenticated, blockUser);
router.route("/unBlockUser").post(isAuthenticated, unBlockUser);


// New route for search functionality
router.route("/search").get(isAuthenticated, searchUsers);

export default router;
