import { Game } from "../models/game.Model.js";
import { User } from "../models/user.Model.js";

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

        // Fetch the game by ID from the database, populate relatedGroups
        const game = await Game.findById(id).populate('relatedGroups.group');

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        // Populate additional information for the author of each related group
        for (const relatedGroup of game.relatedGroups) {
            if (relatedGroup.group.author) {
                // Populate additional fields for the author using the User model
                const authorInfo = await User.findById(relatedGroup.group.author)
                    .select('_id fullName profilePhoto');
                relatedGroup.group.author = authorInfo;
            }
        }

        // Return the fetched game
        res.status(200).json(game);
    } catch (error) {
        console.error("Error while getting single game:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const updateGame = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, coverPhoto, description, ratings } = req.body;

        // Find the game by ID and update it
        const updatedGame = await Game.findByIdAndUpdate(id, {
            name,
            coverPhoto,
            description,
            ratings,
        }, { new: true });

        if (!updatedGame) {
            return res.status(404).json({ message: "Game not found" });
        }

        // Return the updated game
        res.status(200).json(updatedGame);
    } catch (error) {
        console.error("Error while updating game:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const deleteGame = async (req, res) => {
    try {
        const id = req.params.id;

        // Find the game by ID and delete it
        const deletedGame = await Game.findByIdAndDelete(id);

        if (!deletedGame) {
            return res.status(404).json({ message: "Game not found" });
        }

        // Return a success message
        res.status(200).json({ message: "Game deleted successfully" });
    } catch (error) {
        console.error("Error while deleting game:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
