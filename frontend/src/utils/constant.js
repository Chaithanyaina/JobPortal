const isLocal = window.location.hostname === "localhost"; // Check if running locally

const LOCAL_BASE_URL = "http://localhost:8000";
const ENV_BASE_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env for production

const BASE_URL = isLocal ? LOCAL_BASE_URL : ENV_BASE_URL; // Auto-switch based on environment

export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
