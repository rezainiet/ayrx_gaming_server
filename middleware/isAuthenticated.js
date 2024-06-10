import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(req.cookies)
        console.log('Token from cookie:', token); // Log token
        if (!token) {
            return res.status(401).json({ message: "User not authenticated!" });
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded token:', decoded); // Log decoded token
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.id = decoded.userId;
        req.role = decoded.role; // Set user role to request object
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default isAuthenticated;
