import React from "react";
import { Link } from "react-router-dom";
import PulseLine from "../components/PulseLine.jsx";

export default function Home() {
  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero-inner">
          <span className="eyebrow">EPICS in IEEE — Emergency Blood & Platelet Network</span>
          <h1>Every 2 seconds, someone needs blood. Most never get it fast enough.</h1>
          <p className="lede">
            We connect eligible donors, hospitals, and NGOs the moment an emergency
            request comes in — using AI to match the right donor, verify availability,
            and notify only the people who can actually help. No scrolling through
            outdated donor lists. No slow phone trees.
          </p>
          <div className="hero-ctas">
            <Link to="/user"><button className="primary">Register as a donor</button></Link>
            <Link to="/user"><button className="ghost" style={{ color: "white", borderColor: "rgba(247,246,243,0.35)" }}>Raise an emergency request</button></Link>
          </div>
        </div>
        <PulseLine color="#e8535f" />
      </section>

      {/* ===== Impact / why this matters ===== */}
      <section className="impact-band">
        <div className="container">
          <div className="impact-grid">
            <div className="impact-item">
              <span className="big">120.4M</span>
              <div className="cap">blood donations collected worldwide in 2023 — yet demand still outpaces supply in most lower-income regions.</div>
            </div>
            <div className="impact-item">
              <span className="big">0.4–53</span>
              <div className="cap">donations per 1,000 people — the gap between the weakest and strongest national blood systems, per WHO.</div>
            </div>
            <div className="impact-item">
              <span className="big">4.5</span>
              <div className="cap">donations per 1,000 people in low-income countries, against a WHO benchmark of 10–20 needed to meet basic demand.</div>
            </div>
            <div className="impact-item">
              <span className="big">1 unit</span>
              <div className="cap">of safe blood can save up to three lives — mothers in childbirth, trauma patients, children with severe anaemia.</div>
            </div>
          </div>
          <div className="impact-source">
            Source: WHO Global Status Report on Blood Safety and Availability 2025, data from 168 countries.
          </div>
        </div>
      </section>

      {/* ===== The real problem ===== */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">The problem</span>
          <h2 style={{ fontSize: 30, marginTop: 10, marginBottom: 16, maxWidth: 640 }}>
            The blood usually exists. Finding it in time is what fails.
          </h2>
          <p style={{ maxWidth: 640, color: "var(--ink-soft)", lineHeight: 1.6, fontSize: 15 }}>
            Most shortages aren't a supply problem — they're a coordination problem.
            A compatible donor may be five minutes away, but hospitals rely on manual
            phone calls, WhatsApp broadcasts, and paper registers that can't tell who's
            actually eligible, available, or close enough to help in time. Every delay
            is a delay for a patient in surgery, a mother in labour, or a child needing
            a transfusion.
          </p>
        </div>
      </section>

      {/* ===== Three panels ===== */}
      <section className="section-tight">
        <div className="container">
          <span className="eyebrow">Built for everyone in the chain</span>
          <h2 style={{ fontSize: 26, marginTop: 10, marginBottom: 24 }}>One network, three roles</h2>
          <div className="panels-preview">
            <Link to="/user" className="panel-card">
              <span className="tag">Donors &amp; patients</span>
              <h3>User Panel</h3>
              <p>Register as a donor in under a minute, or describe an emergency in
              plain language — AI extracts blood type, urgency, and quantity automatically.</p>
            </Link>
            <Link to="/distributor" className="panel-card">
              <span className="tag">Hospitals &amp; blood banks</span>
              <h3>Distributor Panel</h3>
              <p>Track live inventory by blood type, see incoming requests ranked by
              urgency, and mark requests fulfilled as donors arrive.</p>
            </Link>
            <Link to="/admin" className="panel-card">
              <span className="tag">NGOs &amp; coordinators</span>
              <h3>NGO / Admin Panel</h3>
              <p>Monitor the whole network at a glance, with AI-generated summaries and
              shortage forecasts so you can act before a crisis, not after.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Trust / how matching works ===== */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <span className="eyebrow">How matching works</span>
          <h2 style={{ fontSize: 26, marginTop: 10, marginBottom: 20 }}>
            Only the right donors get notified
          </h2>
          <div className="stat-grid" style={{ marginBottom: 8 }}>
            <div className="stat-card">
              <span className="value">Step 1</span>
              <div className="label">Blood-type compatibility filters the donor pool instantly</div>
            </div>
            <div className="stat-card">
              <span className="value">Step 2</span>
              <div className="label">Distance is calculated in real time, not by static location fields</div>
            </div>
            <div className="stat-card">
              <span className="value">Step 3</span>
              <div className="label">A reliability score, built from donor response history, ranks who's most likely to show up</div>
            </div>
            <div className="stat-card">
              <span className="value">Step 4</span>
              <div className="label">Only the top 5 matches are notified — protecting donors from alert fatigue</div>
            </div>
          </div>
          <div className="trust-row" style={{ marginTop: 24 }}>
            <span className="item">✓ Built for EPICS in IEEE — Engineering Projects in Community Service</span>
            <span className="item">✓ Designed to run with a verified NGO / blood bank partner</span>
            <span className="item">✓ AI-assisted, human-verified</span>
          </div>
        </div>
      </section>
    </div>
  );
}
