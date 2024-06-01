import { Game } from "../models/game.Model.js";
import { GameGroupPost } from "../models/gameGroupPost.Model.js";
import { Group } from "../models/group.Model.js";
import { User } from "../models/user.Model.js";
import asyncHandler from "express-async-handler";

export const createGroup = asyncHandler(async (req, res) => {
    try {
        const { title, description, coverPhoto, author, gameId } = req.body;

        // Create the group
        const group = new Group({
            title,
            description,
            coverPhoto,
            author,
            members: [author]
        });

        // Save the group to the database
        const savedGroup = await group.save();

        // Add the group to the author's groups array
        await User.findByIdAndUpdate(author, {
            $push: { groups: savedGroup._id }
        }, { new: true });

        // Add the group to the related groups of the game (if gameId is provided)
        if (gameId) {
            await Game.findByIdAndUpdate(gameId, {
                $push: { relatedGroups: { group: savedGroup._id } }
            }, { new: true });
        }

        // Return the created group
        res.status(201).json(savedGroup);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});


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


export const getSingleGroupInfo = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // Fetch the group by ID from the database
        const group = await Group.findById(groupId)
            .populate({
                path: 'author',
                select: '_id profilePhoto fullName'
            })
            .populate({
                path: 'members',
                select: '_id profilePhoto fullName'
            })
            .populate({
                path: 'posts',
                populate: [
                    {
                        path: 'author',
                        select: '_id profilePhoto fullName'
                    },
                    {
                        path: 'likes',
                        select: '_id profilePhoto fullName'
                    },
                    {
                        path: 'comments',
                        populate: {
                            path: 'author',
                            select: '_id profilePhoto fullName'
                        }
                    }
                ]
            });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Return the fetched group with populated author, members, posts, and comments
        res.status(200).json(group);
    } catch (error) {
        console.error("Error while getting single group:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};



export const joinGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    console.log(groupId, userId)
    // Check if the user is already a member of the group
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    if (group.members.includes(userId)) {
        return res.status(400).json({ message: "User is already a member of the group" });
    }

    // Add the user to the group's members array
    group.members.push(userId);
    console.log(group.members)
    await group.save();

    // Add the group to the user's groups array
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.groups.push(groupId);
    await user.save();

    res.status(200).json({ message: "User joined the group successfully" });
});


export const leaveGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    console.log(groupId, userId);

    // Check if the group exists
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user is a member of the group
    if (!group.members.includes(userId)) {
        return res.status(400).json({ message: "User is not a member of the group" });
    }

    // Remove the user from the group's members array
    group.members = group.members.filter(member => member.toString() !== userId);
    console.log(group.members);
    await group.save();

    // Remove the group from the user's groups array
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.groups = user.groups.filter(group => group.toString() !== groupId);
    await user.save();

    res.status(200).json({ message: "User left the group successfully" });
});


export const updateGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { title, coverPhoto } = req.body;

    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    // Update the group's title and cover photo if provided
    if (title) group.title = title;
    if (coverPhoto) group.coverPhoto = coverPhoto;

    // Save the updated group
    await group.save();

    res.status(200).json({ message: "Group updated successfully", group });
});