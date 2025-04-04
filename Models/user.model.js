const mongoose=require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    resume: { type: Buffer},
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    role: { type: String, enum: ["seeker", "admin"], default: "seeker" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports= User;
