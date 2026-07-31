import React, { useEffect, useState } from "react";
import { listDistributors, listRequests, updateRequestStatus, updateInventory } from "../api.js";

export default function DistributorPanel() {
  const [distributors, setDistributors] = useState([]);
  const [requests, setRequests] = useState([]);

  const load = async () => {
    setDistributors(await listDistributors());
    setRequests(await listRequests());
  };

  useEffect(() => {
    load();
  }, []);

  const fulfill = async (id) => {
    await updateRequestStatus(id, "fulfilled");
    load();
  };

  const adjustStock = async (distId, bloodType, delta) => {
    const dist = distributors.find((d) => d.id === distId);
    const current = dist.inventory[bloodType] || 0;
    await updateInventory(distId, { [bloodType]: Math.max(0, current + delta) });
    load();
  };

  return (
    <div className="container section-tight">
      <span className="eyebrow">Hospitals &amp; blood banks</span>
      <h2 style={{ fontSize: 26, margin: "10px 0 20px" }}>Distributor Panel</h2>

      <div className="card">
        <h3>Inventory</h3>
        {distributors.map((d) => (
          <div key={d.id} style={{ marginBottom: 16 }}>
            <b>{d.name}</b>
            <table>
              <thead>
                <tr>
                  <th>Blood Type</th>
                  <th>Units</th>
                  <th>Adjust</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(d.inventory).map(([type, units]) => (
                  <tr key={type}>
                    <td>{type}</td>
                    <td>{units}</td>
                    <td>
                      <button className="secondary" onClick={() => adjustStock(d.id, type, -1)}>
                        -1
                      </button>{" "}
                      <button onClick={() => adjustStock(d.id, type, 1)}>+1</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Incoming Emergency Requests</h3>
        <table>
          <thead>
            <tr>
              <th>Blood Type</th>
              <th>Units</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Matched Donors</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.bloodType}</td>
                <td>{r.quantityUnits}</td>
                <td>
                  <span className={`badge ${r.urgency}`}>{r.urgency}</span>
                </td>
                <td>
                  <span className={`badge ${r.status}`}>{r.status}</span>
                </td>
                <td>{r.matchedDonors?.length || 0}</td>
                <td>
                  {r.status !== "fulfilled" && (
                    <button onClick={() => fulfill(r.id)}>Mark Fulfilled</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
