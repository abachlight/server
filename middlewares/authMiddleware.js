import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error.message); // Log the exact error for debugging
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default protect;
