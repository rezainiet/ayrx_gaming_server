import { Game } from "../models/game.Model.js";

export const createGame = async (req, res) => {
    try {
        const { name, coverPhoto, description, genre, ratings, relatedGroups } = req.body;

        // Validate required fields
        if (!name || !description || !genre) {
            return res.status(400).json({ message: "Name, description, and genre are required." });
        }

        // Create a new game instance
        const newGame = new Game({
            name,
            coverPhoto,
            description,
            genre,
            ratings,
            relatedGroups
        });

        // Save the game to the database
        const savedGame = await newGame.save();

        // Return the created game
        res.status(201).json(savedGame);
    } catch (error) {
        console.error("Error creating game:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


export const getGames = async (req, res) => {
    try {
        // Fetch all games from the database
        const games = await Game.find();
        // const games = await Game.find().populate('relatedGroups.group');

        // Return the fetched games
        res.status(200).json(games);
    } catch (error) {
        console.error("Error while getting games:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


export const getSingleGame = async (req, res) => {
    try {
        const id = req.params.id;

        // Fetch the game by ID from the database
        // const game = await Game.findById(id).populate('relatedGroups.group');
        const game = await Game.findById(id);

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        // Return the fetched game
        res.status(200).json(game);
    } catch (error) {
        console.error("Error while getting single game:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};