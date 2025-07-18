import mongoose from "mongoose";
const resumeSchema = new mongoose.Schema({
  uid: { type: String, ref: "User", required: true },
  resumetext: { type: String, required: true },
});

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
