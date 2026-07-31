import React, { useEffect, useState } from "react";
import { getDashboard, getAISummary, getForecast, listRequests } from "../api.js";

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [forecast, setForecast] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const loadStats = async () => {
    setStats(await getDashboard());
    setRequests(await listRequests());
  };

  useEffect(() => {
    loadStats();
  }, []);

  const runAIInsights = async () => {
    setLoadingAI(true);
    try {
      const [summaryRes, forecastRes] = await Promise.all([getAISummary(), getForecast()]);
      setAiSummary(summaryRes.summary);
      setForecast(forecastRes);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="container section-tight">
      <span className="eyebrow">NGOs &amp; coordinators</span>
      <h2 style={{ fontSize: 26, margin: "10px 0 20px" }}>NGO / Admin Panel</h2>

      {stats && (
        <div className="stat-grid">
          <StatCard label="Total Donors" value={stats.totalDonors} />
          <StatCard label="Available Now" value={stats.availableDonors} />
          <StatCard label="Open Requests" value={stats.openRequests} />
          <StatCard label="Fulfilled" value={stats.fulfilledRequests} />
        </div>
      )}

      <div className="card">
        <h3>AI-Generated Insights</h3>
        <p className="ai-note">
          Powered by Groq/Ollama — set AI_PROVIDER in backend/.env to choose which one.
        </p>
        <button onClick={runAIInsights} disabled={loadingAI}>
          {loadingAI ? "Generating..." : "Generate AI Summary & Forecast"}
        </button>

        {aiSummary && (
          <div style={{ marginTop: 14 }}>
            <b>Dashboard Summary:</b>
            <p>{aiSummary}</p>
          </div>
        )}

        {forecast && (
          <div style={{ marginTop: 14 }}>
            <b>Shortage Forecast:</b>
            <p>{forecast.explanation}</p>
            <table>
              <thead>
                <tr>
                  <th>Blood Type</th>
                  <th>Donor Supply</th>
                  <th>Requests (Demand)</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys({ ...forecast.donorSupply, ...forecast.requestDemand }).map(
                  (type) => (
                    <tr key={type}>
                      <td>{type}</td>
                      <td>{forecast.donorSupply[type] || 0}</td>
                      <td>{forecast.requestDemand[type] || 0}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3>All Emergency Requests</h3>
        <table>
          <thead>
            <tr>
              <th>Blood Type</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.bloodType}</td>
                <td>
                  <span className={`badge ${r.urgency}`}>{r.urgency}</span>
                </td>
                <td>
                  <span className={`badge ${r.status}`}>{r.status}</span>
                </td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}
