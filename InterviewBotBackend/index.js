import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import otprouter from "./routers/Otprouter.js";
import mongoose from "mongoose";
import User from "./models/Userschema.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routers/Authentication.js"
import fileUpload from "express-fileupload";
import Resume from "./models/Resume.js";
import { PdfReader } from "pdfreader";
import Resumefound from "./routers/startcalll.js";
import 'dotenv/config';
import chatRouter from './routers/ollamaRoute.js'; // Adjust path as needed

const app = express();
app.use(fileUpload())
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true               
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const MONGO_URI = "mongodb://localhost:27017/interviewbot";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.use('/api', otprouter);

app.post('/api/signup', async (req, res) => {
  const { email, profile, uid, name } = req.body;

  console.log("Received signup data:", { email, profile, uid, name });

  if (!email || !uid  ) {
    return res.status(400).json({ error: "Email, UID, and name are required" });
  }
  if(!name)
  {
    
    name = email.split('@')[0];
    console.log(name); // Output: patrickjamescummins
  }

  try {
    const userfound = await User.findOne({ uid });
    if (userfound) {
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = new User({
      email,
      uid,
      name,
      profile
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({
      error: "Error creating user",
      details: err.message
    });
  }
});

app.use("/api/userdata", userRoutes)

app.post("/api/upload-resume", async (req, res) => {
  console.log("Received resume upload request");
  const { userId } = req.body;
  const file = req.files?.resume;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fullText = await new Promise((resolve, reject) => {
      const textChunks = [];

      new PdfReader().parseBuffer(file.data, (err, item) => {
        if (err) {
          reject("Error parsing PDF: " + err);
        } else if (!item) {
          resolve(textChunks.join(" "));
        } else if (item.text) {
          textChunks.push(item.text);
        }
      });
    });

    const updatedResume = await Resume.findOneAndUpdate(
      { uid: userId },
      { resumetext: fullText },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: "Resume parsed and saved successfully",
      data: fullText,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

 app.use('/api', Resumefound);
app.use('/api', chatRouter);


 const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
