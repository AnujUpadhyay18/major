const mongoose=require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profilepic:{type:Buffer},
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" ,appliedAt: { type: Date }}],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    resetToken: String,
    resetTokenExpires: Date,
    message:{type:Number},
    resumes: [{
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
      resumeUrl: { type: String },
      appliedAt: { type: Date }
    }],
    role: { type: String, enum: ["seeker", "admin"], default: "seeker" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports= User;
