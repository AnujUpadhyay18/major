const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});
const jobSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    destination: { type: String, required: true },
    location: { type: String, required: true },
    description: [{ type: String }],
    image: [{ type: String }],
    tour: [tourSchema],
    price: { type: Number, required: true }
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
