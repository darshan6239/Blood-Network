import express from "express";
import { db, nextId } from "../data/db.js";
import { screenDonorEligibility } from "../services/aiService.js";

const router = express.Router();

// Register as a donor
router.post("/register", (req, res) => {
  const { name, bloodType, lat, lng, phone } = req.body;
  const donor = {
    id: nextId("d"),
    name,
    bloodType,
    lat,
    lng,
    phone,
    available: true,
    lastDonationDate: null,
    reliabilityScore: 0.7, // starting default, adjusts over time based on response history
  };
  db.donors.push(donor);
  res.status(201).json(donor);
});

// List all donors (for admin/testing)
router.get("/", (req, res) => {
  res.json(db.donors);
});

// Toggle availability
router.patch("/:id/availability", (req, res) => {
  const donor = db.donors.find((d) => d.id === req.params.id);
  if (!donor) return res.status(404).json({ error: "Donor not found" });
  donor.available = req.body.available;
  res.json(donor);
});

// AI-assisted eligibility screening before a donation
router.post("/:id/screen", async (req, res) => {
  const donor = db.donors.find((d) => d.id === req.params.id);
  if (!donor) return res.status(404).json({ error: "Donor not found" });

  const result = await screenDonorEligibility(req.body.answers);
  res.json(result);
});

export default router;
