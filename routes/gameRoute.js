import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createGame, getGames, getSingleGame, updateGame, deleteGame } from "../controllers/gameController.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createGame);
router.route("/getGames").get(getGames);
router.route("/getGames/:id").get(getSingleGame);
router.route("/updateGame/:id").put(isAuthenticated, updateGame);
router.route("/deleteGame/:id").delete(isAuthenticated, deleteGame);

export default router;
