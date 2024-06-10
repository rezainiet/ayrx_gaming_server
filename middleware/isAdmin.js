const isAdmin = (req, res, next) => {
    try {
        // Check if the user is authenticated and their role is set in req
        if (!req.id || !req.role) {
            return res.status(401).json({ message: "User not authenticated!" });
        }
        // Check if the user role is admin
        if (req.role !== 'admin') {
            return res.status(403).json({ message: "Access forbidden: Admins only" });
        }
        next();
    } catch (error) {
        console.error("Authorization error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default isAdmin;
