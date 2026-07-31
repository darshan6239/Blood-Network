import express from "express";
import { db } from "../data/db.js";
import { generateSummary, forecastShortageExplanation } from "../services/aiService.js";

const router = express.Router();

// Dashboard overview stats
router.get("/dashboard", (req, res) => {
  const totalDonors = db.donors.length;
  const availableDonors = db.donors.filter((d) => d.available).length;
  const openRequests = db.requests.filter((r) => r.status !== "closed").length;
  const fulfilledRequests = db.requests.filter((r) => r.status === "fulfilled").length;

  res.json({ totalDonors, availableDonors, openRequests, fulfilledRequests });
});

// AI-generated plain-language summary for the admin dashboard
router.get("/dashboard/ai-summary", async (req, res) => {
  const context = {
    totalDonors: db.donors.length,
    openRequests: db.requests.filter((r) => r.status !== "closed").length,
    recentRequests: db.requests.slice(-5),
  };
  const summary = await generateSummary(context);
  res.json({ summary });
});

// AI-generated shortage forecast explanation
router.get("/dashboard/forecast", async (req, res) => {
  const bloodTypeCounts = {};
  db.donors.forEach((d) => {
    bloodTypeCounts[d.bloodType] = (bloodTypeCounts[d.bloodType] || 0) + 1;
  });

  const requestCounts = {};
  db.requests.forEach((r) => {
    requestCounts[r.bloodType] = (requestCounts[r.bloodType] || 0) + 1;
  });

  const explanation = await forecastShortageExplanation({
    donorSupply: bloodTypeCounts,
    requestDemand: requestCounts,
  });

  res.json({ donorSupply: bloodTypeCounts, requestDemand: requestCounts, explanation });
});

// Verify/manage NGOs
router.get("/", (req, res) => res.json(db.ngos));

export default router;
