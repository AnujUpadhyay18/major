const mongoose = require('mongoose');



const holidayPackageSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  destination: { type: String, required: true },
  location: { type: String, required: true },
  description: [{ type: String }],
  image: [{ type: String }],
  tour: [tourSchema],
  price: { type: Number, required: true }
});

const HolidayPackage = mongoose.model('HolidayPackage', holidayPackageSchema);

module.exports = HolidayPackage;
