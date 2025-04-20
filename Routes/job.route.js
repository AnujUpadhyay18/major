const express = require('express');
const {  createJob, updateJob, deleteJob } = require('../Controllers/JobController');
const {  employerProtect } = require('../Middlewares/authMiddleware');
const upload = require("../Middlewares/uploadMiddlewares")
const router = express.Router();
const job= require('../Models/job.model')

// router.get('/', getJobs);
// router.get('/:id', getJobById);
router.post('/create', employerProtect, upload.fields([{ name: 'companyLogo', maxCount: 1 }, { name: 'jobDescriptionFile', maxCount: 1 }]),createJob);
router.put('/update/:id', employerProtect, updateJob);
router.delete('/delete/:id', employerProtect, deleteJob);
router.get("/jobs", async (req, res) => {
    try {
      const { keyword, location } = req.query;
      const query = {};
  
      if (keyword) {
        query.$or = [
          { title: { $regex: keyword, $options: "i" } },
          { company: { $regex: keyword, $options: "i" } }
        ];
      }
  
      if (location) {
        query.location = { $regex: location, $options: "i" };
      }
  
      const jobs = await job.find(query);
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get("/job/:id", async (req, res) => {
    try {
  
      const jobdata = await job.findById({_id:req.params.id}); // ✅ First declare and assign

      if (!jobdata) {
        return res.status(404).json({ error: "Job not found" }); // ✅ Now this is safe
      }
  
      res.status(200).json(jobdata); // ✅ Return the job
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  
module.exports = router;