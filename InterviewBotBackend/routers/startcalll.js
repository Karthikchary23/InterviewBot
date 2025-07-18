import Resume from "../models/Resume.js";
import { Router } from "express";
const router = Router();

router.get('/startcall',async (req, res) => {
  const { userId } = req.query;
  try {
    const resume = await Resume.findOne({ uid: userId });

    if (resume) {
      return res.status(200).json({ message: "Resume found", resumeId: resume._id });
    } else {
      return res.status(404).json({ message: "Resume not found" });
    }
  } catch (err) {
    console.error("Error querying resume:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;