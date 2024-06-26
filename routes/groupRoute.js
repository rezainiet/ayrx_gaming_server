import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createGroup, getRelatedGroups, getSingleGroupInfo, joinGroup, leaveGroup, updateGroup } from "../controllers/groupController.js";

const router = express.Router();

// Route to create a group related to a game
router.route("/create").post(isAuthenticated, createGroup);
router.route("/relatedGroups/:gameId").get(isAuthenticated, getRelatedGroups);
router.route("/getGroup/:groupId").get(getSingleGroupInfo);
router.route("/:groupId/join").post(isAuthenticated, joinGroup);
router.route("/:groupId/leave").post(isAuthenticated, leaveGroup);
router.route("/:groupId/update").put(isAuthenticated, updateGroup);

export default router;
