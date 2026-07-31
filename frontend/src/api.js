import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Donors / User panel
export const registerDonor = (data) => api.post("/donors/register", data).then((r) => r.data);
export const listDonors = () => api.get("/donors").then((r) => r.data);
export const setDonorAvailability = (id, available) =>
  api.patch(`/donors/${id}/availability`, { available }).then((r) => r.data);
export const screenDonor = (id, answers) =>
  api.post(`/donors/${id}/screen`, { answers }).then((r) => r.data);

// Requests (used by User panel to raise, Distributor panel to fulfill)
export const createRequest = (data) => api.post("/requests", data).then((r) => r.data);
export const listRequests = () => api.get("/requests").then((r) => r.data);
export const getRequest = (id) => api.get(`/requests/${id}`).then((r) => r.data);
export const updateRequestStatus = (id, status) =>
  api.patch(`/requests/${id}/status`, { status }).then((r) => r.data);

// NGO / Admin panel
export const getDashboard = () => api.get("/ngo/dashboard").then((r) => r.data);
export const getAISummary = () => api.get("/ngo/dashboard/ai-summary").then((r) => r.data);
export const getForecast = () => api.get("/ngo/dashboard/forecast").then((r) => r.data);

// Distributor panel
export const listDistributors = () => api.get("/distributors").then((r) => r.data);
export const registerDistributor = (data) =>
  api.post("/distributors/register", data).then((r) => r.data);
export const updateInventory = (id, inventory) =>
  api.patch(`/distributors/${id}/inventory`, { inventory }).then((r) => r.data);

export default api;
