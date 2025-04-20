const User = require('../Models/user.model');
const Employer = require('../Models/Employer.model');
const Job = require('../Models/job.model');
const Application = require('../Models/Application.model');

exports.getUsers = async (req, res) => {
  const users = await User.find({ role: { $ne: 'admin' } });
  res.json(users);
};
exports.editUsers = async (req, res) => {
  const users = await User.find({ role: { $ne: 'admin' } });
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

exports.getEmployers = async (req, res) => {
  const employers = await Employer.find();
  res.json(employers);
};

exports.deleteEmployer = async (req, res) => {
  await Employer.findByIdAndDelete(req.params.id);
  res.json({ message: 'Employer deleted' });
};

exports.getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

exports.deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Job deleted' });
};

exports.getApplications = async (req, res) => {
  const applications = await Application.find().populate('user job');
  res.json(applications);
};
