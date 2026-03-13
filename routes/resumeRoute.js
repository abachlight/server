import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  updateResume,
} from "../Controllers/resumeController.js";
// For reading the uploads file
import multer from "multer";

const resumeRouter = express.Router();

const upload = multer(); // stores files in memory, no disk storage

resumeRouter.use((req, res, next) => {
  console.log("Resume route hit:", req.method, req.originalUrl);
  next();
});

// create resume
resumeRouter.post("/create", protect, createResume);

// update resume
resumeRouter.put("/:resumeId", protect, upload.single("image"), updateResume);

// delete resume
resumeRouter.delete("/:resumeId", protect, deleteResume);

// private resume
resumeRouter.get("/:resumeId", protect, getResumeById);

// public resume
resumeRouter.get("/public/:resumeId", getPublicResumeById);

export default resumeRouter;
