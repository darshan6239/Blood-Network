import React, { useState } from "react";
import { registerDonor, createRequest } from "../api.js";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function UserPanel() {
  const [tab, setTab] = useState("donate"); // "donate" | "request"

  return (
    <div className="container section-tight">
      <span className="eyebrow">Donor &amp; requester tools</span>
      <h2 style={{ fontSize: 26, margin: "10px 0 20px" }}>Give blood, or ask for it — fast</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          className={tab === "donate" ? "" : "secondary"}
          onClick={() => setTab("donate")}
        >
          Become a Donor
        </button>
        <button
          className={tab === "request" ? "" : "secondary"}
          onClick={() => setTab("request")}
        >
          Raise Emergency Request
        </button>
      </div>

      {tab === "donate" ? <DonorForm /> : <RequestForm />}
    </div>
  );
}

function DonorForm() {
  const [form, setForm] = useState({ name: "", bloodType: "O+", phone: "", lat: "", lng: "" });
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await registerDonor({
        ...form,
        lat: parseFloat(form.lat) || 19.9975,
        lng: parseFloat(form.lng) || 73.7898,
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="card">
      <h2>Register as a Donor</h2>
      <p className="ai-note">
        Location is used to find nearby emergencies (Google Maps API — add your key in
        backend/.env to enable live geocoding; using placeholder coordinates for now).
      </p>
      <form onSubmit={submit}>
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          value={form.bloodType}
          onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
        >
          {BLOOD_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          placeholder="Latitude (optional)"
          value={form.lat}
          onChange={(e) => setForm({ ...form, lat: e.target.value })}
        />
        <input
          placeholder="Longitude (optional)"
          value={form.lng}
          onChange={(e) => setForm({ ...form, lng: e.target.value })}
        />
        <button type="submit">Register</button>
      </form>
      {status === "done" && <p style={{ color: "green" }}>✅ Registered successfully!</p>}
      {status === "error" && <p style={{ color: "red" }}>Something went wrong.</p>}
    </div>
  );
}

function RequestForm() {
  const [rawText, setRawText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const req = await createRequest({
        rawText,
        lat: 19.9975,
        lng: 73.7898,
      });
      setResult(req);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Raise an Emergency Blood Request</h2>
      <p className="ai-note">
        Describe the need in plain language — AI (Groq/Ollama) will extract blood type,
        urgency, and quantity automatically.
      </p>
      <form onSubmit={submit}>
        <textarea
          rows={4}
          placeholder='e.g. "Need 2 units O-negative urgently for surgery at City Hospital"'
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Finding donors..." : "Submit Request"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 16 }}>
          <h3>Request Created</h3>
          <p>
            Blood type: <b>{result.bloodType}</b> | Urgency:{" "}
            <span className={`badge ${result.urgency}`}>{result.urgency}</span> | Units:{" "}
            <b>{result.quantityUnits}</b>
          </p>
          <h4>Matched Donors (top {result.matchedDonors.length})</h4>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Blood Type</th>
                <th>Distance</th>
                <th>Match Score</th>
              </tr>
            </thead>
            <tbody>
              {result.matchedDonors.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.bloodType}</td>
                  <td>{d.distanceKm} km</td>
                  <td>{d.matchScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
