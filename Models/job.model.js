const mongoose=require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    Employer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    category: { type: String, enum: ["IT", "Healthcare", "Marketing", "Finance", "Education"], required: true },
    experience: { type: String, required: true },
    jobType: { type: String, enum: ["Full-time", "Part-time", "Contract"], required: true },
    description: { type: String, required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
module.exports= Job;
