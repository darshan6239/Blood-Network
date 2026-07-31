import express from "express";
import { db, nextId } from "../data/db.js";

const router = express.Router();

// List all distributors
router.get("/", (req, res) => res.json(db.distributors));

// Register new distributor (blood bank/hospital)
router.post("/register", (req, res) => {
  const { name, lat, lng, inventory } = req.body;
  const distributor = { id: nextId("dist"), name, lat, lng, inventory: inventory || {} };
  db.distributors.push(distributor);
  res.status(201).json(distributor);
});

// Update inventory levels
router.patch("/:id/inventory", (req, res) => {
  const distributor = db.distributors.find((d) => d.id === req.params.id);
  if (!distributor) return res.status(404).json({ error: "Distributor not found" });
  distributor.inventory = { ...distributor.inventory, ...req.body.inventory };
  res.json(distributor);
});

export default router;
