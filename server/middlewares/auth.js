import jwt from "jsonwebtoken";
import "dotenv/config";

export default function authMiddleware(req, res, next) {
  try {
    const token = req.cookies[process.env.COOKIE_NAME];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}