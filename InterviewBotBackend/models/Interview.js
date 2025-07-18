const interviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  topics: [String], 
  mode: { type: String, enum: ["resume", "single-topic", "mixed"], default: "resume" },
  duration: Number,
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  transcript: [ 
    {
      question: String,
      answer: String,
      timestamp: Date
    }
  ]
});

const Interview = mongoose.model("InterviewSession", interviewSessionSchema);
export default Interview;
