const mongoose=require('mongoose')

const employerSchema = new mongoose.Schema(
  {
    companyName: { type: String},
    name:{type:String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },  
    otpExpires: { type: Date },  
    isVerified: { type: Boolean, default: false },
    industry: { type: String },
    website: { type: String },
    companyLogo: { type: String },
    jobPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    role: { type: String, enum: ["employer", "admin"], default: "employer" },
    resetToken: String,
    resetTokenExpires: Date,
    
  },
  { timestamps: true }
);

const Employer = mongoose.model("Employer", employerSchema);
module.exports= Employer;
