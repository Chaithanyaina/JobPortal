import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Fix CORS issue by removing trailing slash & allowing local frontend
const allowedOrigins = [
    'http://localhost:5173',  // Local frontend for development
    'https://job-sphere-mu.vercel.app'  // Deployed frontend
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`✅ Server running at port ${PORT}`);
    } catch (error) {
        console.error("❌ Failed to start server:", error);
    }
});
