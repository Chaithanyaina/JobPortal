const ENV_BASE_URL = import.meta.env.VITE_API_URL; // Use API URL from environment
const LOCAL_BASE_URL = "http://localhost:8000"; // Fallback for local development

const BASE_URL = ENV_BASE_URL || LOCAL_BASE_URL; // Prioritize ENV_BASE_URL in production

export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
