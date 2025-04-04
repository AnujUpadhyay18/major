const express = require('express');
const { getEmployerJobs, getApplicants } = require('../controllers/employerController');
const { employerProtect } = require('../Middlewares/authMiddleware');
const router = express.Router();

router.get('/my-jobs', employerProtect, getEmployerJobs);
router.get('/applicants/:jobId', employerProtect, getApplicants);

module.exports = router;
