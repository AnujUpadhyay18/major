const express = require('express');
const ApplicationModel=require('../Models/Application.model')
const mongoose= require('mongoose')
const { getUserProfile, updateUserProfile, saveJob, getSavedJobs,getUserResumes,deleteUserResume ,
    getActivity,applyjob,getLatestJobsByAppliedTitles
} = require('../Controllers/userController');
const { protect } = require('../Middlewares/authMiddleware');
const router = express.Router();
const upload= require("../Middlewares/uploadMiddlewares")
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect,upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'logo', maxCount: 1 }] ), updateUserProfile);
router.post('/save-job/:jobId', protect, saveJob);
router.get('/saved-jobs', protect, getSavedJobs);
router.post('/applyjob',protect,upload.single('resume'),applyjob)
router.get('/resumes', protect, getUserResumes);
router.delete('/resume/:userId', protect, deleteUserResume);
router.get('/activity', protect, getActivity);
router.get('/job-notification',protect,getLatestJobsByAppliedTitles)

// routes/user.js or similar
router.get('/check-application/:jobId', protect, async (req, res) => {
    const { jobId } = req.params;
    const applicant = req.user.id;
  
    try {
      const existing = await ApplicationModel.findOne({
        job: new mongoose.Types.ObjectId(jobId),
        applicant: new mongoose.Types.ObjectId(applicant),
      });
  
      
  
      if (existing) {
        return res.json({ alreadyApplied: true });
      }
      res.json({ alreadyApplied: false });
    } catch (err) {
      console.error("Error checking application:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;