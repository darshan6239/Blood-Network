import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import donorRoutes from "./routes/donors.js";
import requestRoutes from "./routes/requests.js";
import ngoRoutes from "./routes/ngo.js";
import distributorRoutes from "./routes/distributor.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Blood & Platelet Emergency Network API" });
});

app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/distributors", distributorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Blood Network API running on http://localhost:${PORT}`);
  console.log(`AI Provider: ${process.env.AI_PROVIDER || "groq"} (set GROQ_API_KEY / OLLAMA in .env)`);
});
