import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // Validate required fields
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        };

        // Validate file upload
        if (!req.file) {
            return res.status(400).json({
                message: "Profile photo is required.",
                success: false
            });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Upload profile photo to Cloudinary
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
                profile: newUser.profile
            },
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
      const { email, password, role } = req.body;
  
      // Validate required fields
      if (!email || !password || !role) {
        return res.status(400).json({
          message: "All fields are required.",
          success: false,
        });
      }
  
      // Find user by email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: "Incorrect email or password.",
          success: false,
        });
      }
  
      // Validate password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({
          message: "Incorrect email or password.",
          success: false,
        });
      }
  
      // Validate role
      if (role !== user.role) {
        return res.status(400).json({
          message: "Account doesn't exist with current role.",
          success: false,
        });
      }
  
      // Generate JWT token
      const tokenData = {
        userId: user._id,
      };
      const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      // Prepare user data for response
      user = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      };
  
      // Set cookie and send response
      return res
        .status(200)
        .cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // HTTPS only in production
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-site cookies
        })
        .json({
          message: `Welcome back ${user.fullname}`,
          user,
          success: true,
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error.",
        success: false,
      });
    }
  };

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        // Validate user ID
        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Update user data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");

        // Upload new profile photo if provided
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            user.profile.profilePhoto = cloudResponse.secure_url;
        }

        // Save updated user
        await user.save();

        // Prepare response
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};