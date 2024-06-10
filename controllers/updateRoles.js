// Example script to update existing users to have a role

import { User } from "../models/user.Model.js";

export const updateRoles = async (req, res) => {
    try {
        await User.updateMany(
            { role: { $exists: false } }, // Check for users without a role
            { $set: { role: 'user' } } // Set the default role to 'user'
        );
        console.log("All existing users updated with default role.");
    } catch (error) {
        console.log(error)
    }
    updateRoles();
};
