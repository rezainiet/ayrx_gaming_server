import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createGame, getGames, getSingleGame } from "../controllers/gameController.js"

const router = express.Router();

router.route("/create").post(isAuthenticated, createGame);
router.route("/getGames").get(getGames);
router.route("/getGames/:id").get(isAuthenticated, getSingleGame);
// router.route("/:id").get(isAuthenticated, getMessage);


export default router;