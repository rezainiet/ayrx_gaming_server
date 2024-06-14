import { User } from "../models/user.Model.js";
import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { Group } from "../models/group.Model.js";
import { Conversation } from "../models/conversation.Model.js";
import { Projects } from '../models/projects.Model.js'


// register user API

export const register = async (req, res) => {
    try {
        const {
            fullName, userName, password, confirmPassword, gender, profilePhoto,
            aboutUser, dob, interests, expertise, userTitle
        } = req.body;

        // Validate required fields
        if (!fullName || !userName || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password not matched!" });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Default profile photo based on gender
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        // Create new user
        const newUser = new User({
            fullName,
            userName,
            password: hashedPassword,
            profilePhoto: profilePhoto || (gender === "female" ? femaleProfilePhoto : maleProfilePhoto),
            gender,
            aboutUser: aboutUser || "",
            dob: dob ? new Date(dob) : null,
            interests: interests || [],
            expertise: expertise || [],
            userTitle: userTitle || ""
        });

        // Save user to the database
        await newUser.save();

        // Respond with success message
        return res.status(201).json({ message: "User created successfully!", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while creating the user.", error });
    }
};





// login api
export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password.",
                success: false
            });
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Incorrect username or password.",
                success: false
            });
        }

        const tokenData = {
            userId: user._id,
            role: user.role
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        const isProduction = process.env.NODE_ENV === 'production';

        return res.status(200).cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true,
            secure: isProduction, // cookie will be sent only over HTTPS in production
            sameSite: isProduction ? 'None' : 'Lax' // use 'Lax' in development to allow cross-origin requests
        }).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            role: user.role
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// admin login api
export const adminLogin = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password.",
                success: false
            });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({
                message: "You don't have any permission to login in admin panel!",
                success: false
            });
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Incorrect username or password.",
                success: false
            });
        }

        const tokenData = {
            userId: user._id,
            role: user.role
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        const isProduction = process.env.NODE_ENV === 'production';

        return res.status(200).cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true,
            secure: isProduction, // cookie will be sent only over HTTPS in production
            sameSite: isProduction ? 'None' : 'Lax' // use 'Lax' in development to allow cross-origin requests
        }).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            role: user.role
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const updateAdminPassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        if (!userId || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                message: "You don't have permission to perform this action.",
                success: false
            });
        }

        const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Old password is incorrect." });
        }

        // const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        const tokenData = {
            userId: user._id,
            role: user.role
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        const isProduction = process.env.NODE_ENV === 'production';

        return res.status(200).cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true,
            secure: isProduction, // cookie will be sent only over HTTPS in production
            sameSite: isProduction ? 'None' : 'Lax' // use 'Lax' in development to allow cross-origin requests
        }).json({ message: "Password updated successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};






// Logout api

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "User successfully logged out!"
        })
    } catch (error) {
        console.log(error)
    }
};

// Fetch all users to the messages
// export const getOtherUsers_Old = async (req, res) => {
//     try {
//         const loggedInUserId = req.id;
//         // const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
//         const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
//         return res.status(200).json(otherUsers)
//     } catch (error) {
//         console.log(error)
//     }
// };

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;

        // Fetch conversations involving the logged-in user
        const conversations = await Conversation.find({
            participants: loggedInUserId
        }).select('participants');

        // Extract participants from conversations, excluding the logged-in user
        const participantIds = new Set();
        conversations.forEach(conversation => {
            conversation.participants.forEach(participantId => {
                if (participantId.toString() !== loggedInUserId) {
                    participantIds.add(participantId.toString());
                }
            });
        });

        // Fetch details of these users, excluding the password field
        const otherUsers = await User.find({
            _id: { $in: Array.from(participantIds) }
        }).select("-password");

        return res.status(200).json(otherUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getRandomUsers = async (req, res) => {
    try {
        const randomUsers = await User.aggregate([
            { $match: { username: { $ne: 'admin' } } }, // Exclude users with username 'admin'
            { $sample: { size: 10 } } // Fetch 10 random users from the filtered set
        ]);
        res.json(randomUsers);
    } catch (error) {
        console.error('Error fetching random users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// update user's Interests
// export const updateUserInterests = async (req, res) => {
//     try {
//         const { userId, interests } = req.body;

//         // Validate input
//         if (!userId || !Array.isArray(interests)) {
//             return res.status(400).json({ message: "Invalid input. userId and interests are required." });
//         }

//         // Find the user by ID and update interests
//         const user = await User.findByIdAndUpdate(
//             userId,
//             { interests },
//             { new: true } // This option returns the updated document
//         );

//         // Check if user was found
//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         // Respond with the updated user data
//         return res.status(200).json({ message: "Interests updated successfully!", user });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "An error occurred while updating interests.", error });
//     }
// };


export const getUserData = async (req, res) => {
    try {
        const userId = req.id;

        // Fetch user data by ID
        const user = await User.findById(userId).select("-password");

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with user data
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching user data.", error });
    }
};


export const getUserDataById = async (req, res) => {
    try {
        const userId = req.params.id;
        const authUserId = req.id; // Assuming req.user contains the authenticated user's data

        // Fetch user data by ID
        const user = await User.findById(userId).select("-password");

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with user data and authenticated user ID
        res.status(200).json({ user, authUserId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching user data.", error });
    }
};


// Update user details API
export const updateUserDetails = async (req, res) => {
    try {
        const userId = req.id; // Assuming you have middleware that adds the user ID to req.user
        const { fullName, userTitle, aboutUser, interests } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fullName,
                userTitle,
                aboutUser,
                interests,
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user details:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};



export const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        // console.log("userId", userId)
        const authUserId = req.id; // Ensure req.user contains the authenticated user's data
        // console.log(id)
        console.log("authUserId", authUserId)
        // console.log(req.user)

        // Update the friend request logic here based on your schema
        await User.findByIdAndUpdate(authUserId, {
            $addToSet: { sentRequests: userId }
        });

        await User.findByIdAndUpdate(userId, {
            $addToSet: { receivedRequests: authUserId }
        });

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request', error });
    }
};

export const cancelFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        const authUserId = req.id; // Ensure req.user contains the authenticated user's data

        // Update the friend request logic here based on your schema
        await User.findByIdAndUpdate(authUserId, {
            $pull: { sentRequests: userId }
        });

        await User.findByIdAndUpdate(userId, {
            $pull: { receivedRequests: authUserId }
        });

        res.status(200).json({ message: 'Friend request cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling friend request', error });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        const authUserId = req.id; // Ensure req.user contains the authenticated user's data

        // Update the friend request logic here based on your schema
        await User.findByIdAndUpdate(authUserId, {
            $pull: { receivedRequests: userId },
            $addToSet: { friends: userId }
        });

        await User.findByIdAndUpdate(userId, {
            $pull: { sentRequests: authUserId },
            $addToSet: { friends: authUserId }
        });

        res.status(200).json({ message: 'Friend request accepted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend request', error });
    }
};


export const blockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const authUserId = req.id; // Ensure req.user contains the authenticated user's data

        // Update the user's blocked users list
        await User.findByIdAndUpdate(authUserId, {
            $addToSet: { blockedUsers: userId }
        });
        await User.findByIdAndUpdate(userId, {
            $addToSet: { gotBlocked: authUserId }
        });

        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error blocking user', error });
    }
};

export const unBlockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const authUserId = req.id; // Ensure req.user contains the authenticated user's data

        // Update the user's blocked users list
        await User.findByIdAndUpdate(authUserId, {
            $pull: { blockedUsers: userId }
        });
        await User.findByIdAndUpdate(userId, {
            $pull: { gotBlocked: authUserId }
        });

        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unblocking user', error });
    }
};



export const searchUsers = expressAsyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
        // Search users
        const users = await User.find({
            $or: [
                { fullName: { $regex: query, $options: 'i' } },
                { aboutUser: { $regex: query, $options: 'i' } }
            ]
        }).select('_id fullName profilePhoto aboutUser');

        // Search groups
        const groups = await Group.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).select('_id title description coverPhoto');

        // Combine and return the results
        const results = [
            ...users.map(user => ({ ...user._doc, type: 'user' })),
            ...groups.map(group => ({ ...group._doc, type: 'group' }))
        ];

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching search results:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

export const updateHourlyRate = async (req, res) => {
    const { hourlyRate } = req.body;
    console.log(hourlyRate)

    if (hourlyRate < 4 || hourlyRate > 100) {
        return res.status(400).json({ message: 'The hourly rate must be between 0% and 100%.' });
    }

    try {
        const user = await User.findById(req.id); // Assuming req.user contains the authenticated user's ID

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.hourlyRate = hourlyRate;
        await user.save();

        res.status(200).json({ message: 'Hourly rate updated successfully.', hourlyRate: user.hourlyRate });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the hourly rate.', error: error.message });
    }
};


export const addUserProject = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract project data from request body
        const { name, coverPhoto, price, tags, description } = req.body;

        // Create a new project object using project schema
        const project = new Projects({
            name,
            coverPhoto,
            price,
            tags,
            description,
            author: userId // Setting the user as the author of the project
        });

        // Save the new project to the database
        const savedProject = await project.save();

        // Add the new project to user's projects array
        user.projects.push(savedProject._id);

        // Save the updated user object
        await user.save();

        res.status(201).json({ message: 'Project added successfully', project: savedProject });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ error: 'Failed to add project' });
    }
};

export const getProjects = async (req, res) => {
    const userId = req.params.userID; // Assuming you have user authentication middleware that sets req.id
    console.log(userId)
    try {
        // Find the user and populate their projects
        const user = await User.findById(userId).populate('projects');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ projects: user.projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const userId = req.id; // Assuming you have user authentication middleware that sets req.id
        const projectId = req.params.id;
        console.log(projectId)

        // Find the project by its ID
        const project = await Projects.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the authenticated user is the author of the project
        // if (project.author.toString() !== userId) {
        //     return res.status(403).json({ message: 'You are not authorized to view this project' });
        // }

        res.json({ project });
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};