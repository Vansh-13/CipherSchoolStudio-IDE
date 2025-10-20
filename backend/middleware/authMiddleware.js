// middleware/authMiddleware.js
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// ESM me __dirname banaye
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv ko explicitly path ke saath configure karo
dotenv.config({ path: path.join(__dirname, "../.env") });

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
