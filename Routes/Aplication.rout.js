const express = require('express');
const { applyForJob, getUserApplications, getApplicantsForJob } = require('../controllers/applicationController');
const { protect, employerProtect } = require('../Middlewares/authMiddleware');
const router = express.Router();

router.post('/apply', protect, applyForJob);
router.get('/my-applications', protect, getUserApplications);
router.get('/job/:jobId', employerProtect, getApplicantsForJob);

module.exports = router;