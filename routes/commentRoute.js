import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createCommentInGameGroup } from "../controllers/commentController.js";

const router = express.Router();

// http://localhost:4000//api/v1/comment/createCommentInGameGroup
router.route("/createCommentInGameGroup").post(isAuthenticated, createCommentInGameGroup);
// router.route("/:id").get(isAuthenticated, getMessage);


export default router;