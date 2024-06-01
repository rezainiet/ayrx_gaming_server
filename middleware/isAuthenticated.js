import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "User not authenticated!" });
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decode) {
            try {
                return res.status(200).cookie("token", "", { maxAge: 0 }).json({
                    message: "User successfully logged out!"
                })
            } catch (error) {
                console.log(error)
            }
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
