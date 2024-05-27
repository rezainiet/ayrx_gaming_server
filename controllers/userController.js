import { User } from "../models/user.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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
            return res.status(400).json({ message: "All fields are required." })
        }
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password.",
                success: false
            })
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Incorrect username or password.",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto
        })
    }
    catch (error) {
        console.log(error)
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


export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers)
    } catch (error) {
        console.log(error)
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
