const express = require('express');
const { getUsers, deleteUser, getEmployers, deleteEmployer, getJobs, deleteJob, getApplications } = require('../controllers/adminController');
const { adminProtect } = require('../Middlewares/authMiddleware');
const router = express.Router();

router.get('/users', adminProtect, getUsers);
router.delete('/user/:id', adminProtect, deleteUser);
router.get('/employers', adminProtect, getEmployers);
router.delete('/employer/:id', adminProtect, deleteEmployer);
router.get('/jobs', adminProtect, getJobs);
router.delete('/job/:id', adminProtect, deleteJob);
router.get('/applications', adminProtect, getApplications);

module.exports = router;
