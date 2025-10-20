import express from "express";
import {
  createProject,
  getUserProjects,
  getProjectById,   // <-- add this
  updateProject,
  deleteProject
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getUserProjects);
router.get("/:id", protect, getProjectById);  // <-- add this route
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
