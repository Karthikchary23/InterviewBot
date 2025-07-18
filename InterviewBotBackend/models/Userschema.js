import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: String,
  name: String,
  profile: {
    type: String,
    default: "https://www.gravatar.com/avatar/"
  },
  role: { type: String, default: "candidate" },
  resumeUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;