import { Game } from "../models/game.Model.js";
import { Group } from "../models/group.Model.js";

export const createGroup = async (req, res) => {
    try {
        // Extract necessary data from the request body
        const { title, description, coverPhoto, author, gameId } = req.body;

        // Create the group
        const group = new Group({
            title,
            description,
            coverPhoto,
            author,
            gameId,
            members: [author] // Assuming the author is automatically a member
        });

        // Save the group to the database
        const savedGroup = await group.save();

        // Add the group to the related groups of the game
        const game = await Game.findByIdAndUpdate(gameId, {
            $push: { relatedGroups: { group: savedGroup._id } }
        }, { new: true });

        // Return the created group
        res.status(201).json(savedGroup);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


export const getRelatedGroups = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        console.log(gameId)

        // Fetch related groups for the specified game from the database
        const relatedGroups = await Group.find({ gameId });
        console.log(relatedGroups);

        // Return the related groups
        res.status(200).json(relatedGroups);
    } catch (error) {
        console.error("Error while getting related groups:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};