import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createGroup, getRelatedGroups } from "../controllers/groupController.js";

const router = express.Router();

// Route to create a group related to a game
router.route("/create").post(isAuthenticated, createGroup);
router.route("/relatedGroups/:gameId").get(isAuthenticated, getRelatedGroups);

export default router;
