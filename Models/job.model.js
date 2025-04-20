const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String },
    Employer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },

    company: { type: String},
    location: { type: String }, // Optional
    category: { 
      type: String, 
      enum: ["Education/Training", "IT & Engineering", "Art/Design", "Sale/Markting", "Healthcare", "Others","Food Services"], 
      
    },

    skills:[{type:String}],
    tags: [{ type: String }], // e.g., PHP, Social Media
    salary: { type: Number },
    experience: { type: String },
    jobType: { 
      type: String, 
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"], 
      
    },

    description: { type: String, required: true },
    applicationURL: { type: String },
    closingDate: { type: Date },

    companyWebsite: { type: String },
    tagline: { type: String },
    logo: { type: String }, 
    jdFile: { type: String }, 

    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
