import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log('Token from cookie:', token); // Add this log
        if (!token) {
            return res.status(401).json({ message: "User not authenticated!" });
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded token:', decode); // Add this log
        if (!decode) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default isAuthenticated;
