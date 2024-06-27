import express from "express";
import {
    getUserData, getUserDataById, login, logout, register,
    updateUserDetails, sendFriendRequest, cancelFriendRequest, acceptFriendRequest,
    blockUser, searchUsers, unBlockUser, updateHourlyRate, addUserProject, getProjects,
    getProjectById, getRandomUsers,
    adminLogin,
    updateAdminPassword,
    getRelevantUsers
} from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { updateRoles } from "../controllers/updateRoles.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getRelevantUsers);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/login-admin").post(adminLogin);
router.route("/updateRole").post(updateRoles);
router.route("/logout").get(logout);
router.route("/getUserDetails").get(isAuthenticated, getUserData);
// router.route("/getUserDetails").get(isAuthenticated, getFriends);
router.route("/getUserDataById/:id").get(isAuthenticated, getUserDataById);
router.route("/updateUserDetails").put(isAuthenticated, updateUserDetails);
router.route("/getRandomUser").get(getRandomUsers);

// Friend request routes
router.route("/sendFriendRequest").post(isAuthenticated, sendFriendRequest);
router.route("/cancelFriendRequest").post(isAuthenticated, cancelFriendRequest);
router.route("/acceptFriendRequest").post(isAuthenticated, acceptFriendRequest);
router.route("/blockUser").post(isAuthenticated, blockUser);
router.route("/unBlockUser").post(isAuthenticated, unBlockUser);

// Search users
router.route("/search").get(isAuthenticated, searchUsers);

// Update hourly rate
router.route("/updateHourlyRate").put(isAuthenticated, updateHourlyRate);

// User projects
router.route("/:userId/addUserProject").post(isAuthenticated, addUserProject);
router.route("/getProjects/:userID").get(isAuthenticated, getProjects);
router.route("/projects/:id").get(isAuthenticated, getProjectById);


// Add new route for updating admin's password
router.route("/updateAdminPassword").put(isAuthenticated, isAdmin, updateAdminPassword);

export default router;
