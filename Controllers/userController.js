// controllers/userController.js
const Job = require('../Models/job.model.js');
const UserModel=require('../Models/user.model.js')
const path = require('path');
const fs = require('fs');
const Employer = require('../Models/Employer.model.js');
const Application=require('../Models/Application.model.js')

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
      const user = req.user;
      const employer = req.employer;
  
      if (!user && !employer) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user) {
        res.json(user);
      } else {
        res.json(employer);
      }
  
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
const getUserResumes = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const resumes = user.resumes.map(resume => {
      const filename = path.basename(resume.resumeUrl); // just the file name
      return {
        _id: resume._id,
        jobId: resume.jobId,
        filename,
        url: `/uploads/resumes/${filename}`, // for frontend
        appliedAt: resume.appliedAt,
      };
    });

    res.json({ resumes });
  } catch (error) {
    console.error('Error getting resumes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete Resume
const deleteUserResume = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
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

const getActivity = async (req, res) => {
  try {
      const user = req.user;
      const employer = req.employer;

      if (user) {
          const appliedJobs = await Job.find({ _id: { $in: user.appliedJobs } });
          const savedJobs = await Job.find({ _id: { $in: user.savedJobs } });

          const resume = user.resume
              ? `${req.protocol}://${req.get("host")}/${user.resume}`
              : null;

          return res.json({
              role: "seeker",
              name: user.name,
              email: user.email,
              resume,
              appliedJobsCount: appliedJobs.length,
              savedJobsCount: savedJobs.length,
              image: user.image || null,
              joinedAt: user.createdAt,
              lastLogin: user.updatedAt,
              activities: [] // Extend this for activity logs
          });
      }

      if (employer) {
          const jobPosts = await Job.find({ Employer_id: employer._id });

          let totalApplicants = 0;

          const jobApplicants = await Promise.all(
              jobPosts.map(async (job) => {
                  const applicants = await UserModel.find({
                      appliedJobs: job._id
                  });
                  totalApplicants += applicants.length;

                  return {
                      jobId: job._id,
                      jobTitle: job.title,
                      applicantsCount: applicants.length
                  };
              })
          );

          return res.json({
              role: "employer",
              name: employer.name,
              email: employer.email,
              companyName: employer.companyName,
              industry: employer.industry,
              website: employer.website,
              companyLogo: employer.companyLogo,
              joinedAt: employer.createdAt,
              lastLogin: employer.updatedAt,
              totalJobsPosted: jobPosts.length,
              totalApplicants,
              jobApplicants,
              activities: []
          });
      }

      return res.status(404).json({ message: "User not found" });

  } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ message: "Server error" });
  }
};



const applyjob = async (req, res) => {
  try {
    const { jobId, resumeId } = req.body;
    const userId = req.user.id;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({ success: false, message: 'Job not found' });
    }

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    let resumePath = null;

    if (req.file) {
      resumePath = req.file.path;

      // Also save resume info to user
      user.resumes.push({
        jobId,
        resumeUrl: resumePath,
        appliedAt: new Date(),
      });

    } else if (resumeId) {
      
      
      const selectedResume = user.resumes.find(
        (r) => r._id.toString() === resumeId
      );
      if (!selectedResume) {
        return res.status(400).json({ success: false, message: 'Selected resume not found' });
      }
      resumePath = selectedResume.resumeUrl;
    } else {
      return res.status(400).json({ success: false, message: 'No resume uploaded or selected' });
    }

    // Add job to applied list if not already applied
    if (!user.appliedJobs.includes(jobId)) {
      user.appliedJobs.push(jobId);
    }

    await user.save();

    // Create the application
    await Application.create({
      job: jobId,
      applicant: userId,
      resume: resumePath,
    });

    res.json({
      success: true,
      message: 'Application submitted successfully!',
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ success: false, message: 'Error applying for job' });
  }
};

const getLatestJobsByAppliedTitles = async (req, res) => {
  try {
    const userId = req.user._id

    const user = await UserModel.findById(userId).populate('appliedJobs');

    const uniqueTitles = [
      ...new Set(user.appliedJobs.map(job => job.title))
    ];

    const latestJobs = await Promise.all(
      uniqueTitles.map(title =>
        Job.findOne({ title }).sort({ createdAt: -1 }) // sort by latest created
      )
    );

    const filtered = latestJobs
      .filter(job => job)
      .map(job => ({
        _id: job._id,
        title: job.title,
        company: job.company,
        createdAt: job.createdAt, // include timestamp
      
      }));
console.log(filtered)

    res.status(200).json({ success: true, jobs: filtered });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = { getUserProfile,applyjob, updateUserProfile, saveJob, getSavedJobs , getUserResumes, deleteUserResume,getActivity,getLatestJobsByAppliedTitles};
