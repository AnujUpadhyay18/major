const express = require('express');
const {  getdashboard } = require('../Controllers/EmployerController');
const { employerProtect,protect } = require('../Middlewares/authMiddleware');
const router = express.Router();

// router.get('/my-jobs', employerProtect, getEmployerJobs);
// router.get('/applicants/:jobId', employerProtect, getApplicants);
router.get('/dashboard',protect,getdashboard)
module.exports = router;
