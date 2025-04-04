// controllers/userController.js
const Job = require('../Models/job.model.js');
const UserModel=require('../Models/user.model.js')
const path = require('path');
const fs = require('fs');

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Save Job
const saveJob = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (!user.savedJobs.includes(job._id)) {
            user.savedJobs.push(job._id);
            await user.save();
        }
        res.json({ message: 'Job saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Saved Jobs
const getSavedJobs = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).populate('savedJobs');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.savedJobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Get Resume Link
const getUserResume = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.resume) return res.status(404).json({ message: 'Resume not found' });

        const resumeUrl = `${req.protocol}://${req.get('host')}/${user.resume}`;
        res.json({ resumeUrl });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Resume
const deleteUserResume = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.resume) return res.status(404).json({ message: 'Resume not found' });

        const resumePath = path.join(__dirname, '..', user.resume);

        // Delete file from local storage
        if (fs.existsSync(resumePath)) {
            fs.unlinkSync(resumePath);
        }

        // Remove resume from database
        user.resume = null;
        await user.save();

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
module.exports = { getUserProfile, updateUserProfile, saveJob, getSavedJobs , getUserResume, deleteUserResume};
