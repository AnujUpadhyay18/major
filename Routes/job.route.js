const express = require('express');
const { getJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, employerProtect } = require('../Middlewares/authMiddleware');
const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/create', employerProtect, createJob);
router.put('/update/:id', employerProtect, updateJob);
router.delete('/delete/:id', employerProtect, deleteJob);

module.exports = router;