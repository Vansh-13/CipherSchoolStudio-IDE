// projectController.js
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Project from "../models/Project.js";

// ESM me __dirname banaye
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv config with explicit path
dotenv.config({ path: path.join(__dirname, "../.env") });

export const createProject = async (req, res) => {
  const { title, files } = req.body;
  try {
    const newProject = await Project.create({ userId: req.user, title, files });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, structure } = req.body; 
  try {
    const updated = await Project.findByIdAndUpdate(
      id,
      { title, structure },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await Project.findByIdAndDelete(id);
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get a single project by ID for the logged-in user
export const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findOne({ _id: id, userId: req.user });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
