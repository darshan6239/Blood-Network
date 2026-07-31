import express from "express";
import { db, nextId } from "../data/db.js";
import { parseEmergencyRequest } from "../services/aiService.js";
import { findMatchingDonors, topDonorsToNotify } from "../services/matchingService.js";

const router = express.Router();

/**
 * Create a new emergency request.
 * Accepts either structured data OR raw free text (rawText), in which case
 * AI (Groq/Ollama) parses it into structured fields first.
 */
router.post("/", async (req, res) => {
  let { bloodType, quantityUnits, urgency, lat, lng, location, rawText } = req.body;

  if (rawText && !bloodType) {
    const parsed = await parseEmergencyRequest(rawText);
    bloodType = parsed.bloodType;
    quantityUnits = parsed.quantityUnits;
    urgency = parsed.urgency;
    location = parsed.location;
  }

  const request = {
    id: nextId("req"),
    bloodType,
    quantityUnits,
    urgency,
    lat,
    lng,
    location,
    status: "open", // open -> matching -> fulfilled -> closed
    createdAt: new Date().toISOString(),
    matchedDonors: [],
  };

  db.requests.push(request);

  // Immediately run matching
  const ranked = await findMatchingDonors(db.donors, request);
  const toNotify = topDonorsToNotify(ranked, 5);
  request.matchedDonors = toNotify;
  request.status = "matching";

  res.status(201).json(request);
});

// List all requests (distributor + admin panels use this)
router.get("/", (req, res) => {
  res.json(db.requests);
});

// Get a single request with its ranked donor matches
router.get("/:id", (req, res) => {
  const request = db.requests.find((r) => r.id === req.params.id);
  if (!request) return res.status(404).json({ error: "Request not found" });
  res.json(request);
});

// Mark request fulfilled/closed (distributor action)
router.patch("/:id/status", (req, res) => {
  const request = db.requests.find((r) => r.id === req.params.id);
  if (!request) return res.status(404).json({ error: "Request not found" });
  request.status = req.body.status;
  res.json(request);
});

export default router;
