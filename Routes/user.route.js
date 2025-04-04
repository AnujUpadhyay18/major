const express = require('express');
const { getUserProfile, updateUserProfile, saveJob, getSavedJobs,getUserResume,deleteUserResume } = require('../Controllers/userController');
const { protect } = require('../Middlewares/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/save-job/:jobId', protect, saveJob);
router.get('/saved-jobs', protect, getSavedJobs);
router.get('/resume/:userId', protect, getUserResume); // View Resume
router.delete('/resume/:userId', protect, deleteUserResume);
module.exports = router;