// Simple in-memory "database" for the demo scaffold.
// Replace with MongoDB / PostgreSQL in production.

export const db = {
  // Donors registered by users
  donors: [
    {
      id: "d1",
      name: "Rahul Sharma",
      bloodType: "O-",
      lat: 19.9975,
      lng: 73.7898, // Nashik coords (sample)
      available: true,
      lastDonationDate: "2026-05-01",
      reliabilityScore: 0.92,
      phone: "+91-9000000001",
    },
    {
      id: "d2",
      name: "Priya Verma",
      bloodType: "A+",
      lat: 19.9615,
      lng: 73.7645,
      available: true,
      lastDonationDate: "2026-03-15",
      reliabilityScore: 0.81,
      phone: "+91-9000000002",
    },
  ],

  // NGOs / Blood Banks (admin panel users)
  ngos: [
    {
      id: "ngo1",
      name: "Red Cross - Nashik Chapter",
      email: "admin@redcross-nashik.org",
      verified: true,
    },
  ],

  // Distributors (hospitals / blood banks that fulfill requests)
  distributors: [
    {
      id: "dist1",
      name: "City Blood Bank",
      lat: 19.9990,
      lng: 73.7910,
      inventory: { "O-": 4, "A+": 10, "B+": 6, "AB+": 2, "O+": 15 },
    },
  ],

  // Emergency requests raised by users/hospitals
  requests: [],
};

export function nextId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
