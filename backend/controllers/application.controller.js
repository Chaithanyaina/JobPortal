import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

// Apply for a Job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        // Validate jobId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid job ID.", success: false });
        }

        // Check if the user has already applied
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job.", success: false });
        }

        // Verify job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        // Create application
        const newApplication = new Application({ job: jobId, applicant: userId });
        await newApplication.save();

        // Link application to job
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({ message: "Job applied successfully.", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Internal server error.", success: false });
    }
};

// Get all jobs applied by a user
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                select: "title company createdAt",
                populate: { path: "company", select: "name" }
            })
            .lean();

        if (!applications.length) {
            return res.status(404).json({ message: "No applications found.", success: false });
        }

        return res.status(200).json({ applications, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Internal server error.", success: false });
    }
};

// Get all applicants for a job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid job ID.", success: false });
        }

        const job = await Job.findById(jobId)
            .populate({
                path: "applications",
                populate: { path: "applicant", model: "User", select: "name email" }
            })
            .lean();

        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Internal server error.", success: false });
    }
};

// Update application status
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: "Status is required.", success: false });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found.", success: false });
        }

        // Update application status
        application.status = status.toLowerCase();
        await application.save();

        // Update status in the job's applications array
        await Job.updateOne(
            { _id: application.job },
            { $set: { "applications.$[elem].status": status.toLowerCase() } },
            { arrayFilters: [{ "elem._id": application._id }] }
        );

        return res.status(200).json({ message: "Status updated successfully.", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Internal server error.", success: false });
    }
};
