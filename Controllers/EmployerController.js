const getdashboard = async (req, res) => {
    const { profile, role } = req;
  
    if (role === "seeker") {
      const latestActivity = [];
  
      const latestApplied = profile.appliedJobs[0];
      const latestSaved = profile.savedJobs[0];
  
      if (latestApplied) {
        latestActivity.push({
          description: `Applied to "${latestApplied.title}"`,
          date: latestApplied.appliedAt ? new Date(latestApplied.appliedAt).toDateString() : "Unknown date",
        });
      }
  
      if (latestSaved) {
        latestActivity.push({
          description: `Saved job "${latestSaved.title}"`,
          date: latestSaved.createdAt ? new Date(latestSaved.createdAt).toDateString() : "Unknown date",
        });
      } console.log()
     
      return res.json({
        name: profile.name,
        email: profile.email,
        role: "jobseeker",
        joined: profile.createdAt?.toDateString() || "Unknown",
        lastLogin: profile.updatedAt?.toDateString() || "Unknown",
        jobsApplied: profile.appliedJobs.length,
        appliedJobs:profile.appliedJobs,
        savedJobs: profile.savedJobs.length,
        seekerMsgCount: profile.message || 0,
        activities: latestActivity,
      });
    }
 
    if (role === "employer") {
      const latestActivity = [];
  
      const latestPosted = profile.jobPosts[0];
  
      if (latestPosted) {
        latestActivity.push({
          description: `Posted new job "${latestPosted.title}"`,
          date: latestPosted.createdAt ? new Date(latestPosted.createdAt).toDateString() : "Unknown date",
        });
      }
  
      return res.json({
        name: profile.name,
        email: profile.email,
        role: "recruiter",
        joined: profile.createdAt?.toDateString() || "Unknown",
        lastLogin: profile.updatedAt?.toDateString() || "Unknown",
        jobsPosted: profile.jobPosts.length,
        jobsPost:profile.jobPosts,
        totalApplicants: profile.jobPosts.reduce(
          (acc, job) => acc + (job.applicants?.length || 0),
          0
        ),
        recruiterMsgCount: profile.message || 0,
        activities: latestActivity,
      });
    }
  
    res.status(400).json({ message: "Invalid role" });
  };
module.exports={getdashboard};  