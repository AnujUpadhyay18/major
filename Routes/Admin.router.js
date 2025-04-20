const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getEmployers,
  deleteEmployer,
  getJobs,
  deleteJob,
  getApplications,editUsers
} = require('../Controllers/AdminController');

const adminProtect = require('../Middlewares/adminProtect');

router.get('/users', adminProtect, getUsers);
router.put('/users', adminProtect, editUsers);
router.delete('/user/:id', adminProtect, deleteUser);

router.get('/employers', adminProtect, getEmployers);
router.delete('/employer/:id', adminProtect, deleteEmployer);

router.get('/jobs', adminProtect, getJobs);
router.delete('/job/:id', adminProtect, deleteJob);

router.get('/applications', adminProtect, getApplications);

module.exports = router;
