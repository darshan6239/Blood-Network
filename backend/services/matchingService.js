import { getDistanceKm } from "./mapsService.js";

// Standard blood compatibility chart: who can donate TO each blood type
const COMPATIBLE_DONORS = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

/**
 * Checks 90-day eligibility window (standard whole blood donation gap).
 */
function isEligibleByDate(lastDonationDate) {
  if (!lastDonationDate) return true;
  const days =
    (Date.now() - new Date(lastDonationDate).getTime()) / (1000 * 60 * 60 * 24);
  return days >= 90;
}

/**
 * Finds and ranks donors for a given request.
 * Ranking factors: blood compatibility, distance, reliability score, eligibility.
 *
 * @param {Array} donors - donor pool
 * @param {Object} request - { bloodType, lat, lng, urgency }
 * @returns {Promise<Array>} ranked donor list with scores
 */
export async function findMatchingDonors(donors, request) {
  const compatibleTypes = COMPATIBLE_DONORS[request.bloodType] || [request.bloodType];

  const candidates = donors.filter(
    (d) =>
      compatibleTypes.includes(d.bloodType) &&
      d.available &&
      isEligibleByDate(d.lastDonationDate)
  );

  const scored = await Promise.all(
    candidates.map(async (donor) => {
      const distanceKm = await getDistanceKm(
        { lat: request.lat, lng: request.lng },
        { lat: donor.lat, lng: donor.lng }
      );

      // Scoring: closer + more reliable = higher score.
      // Weighted: 60% distance factor, 40% reliability factor.
      const distanceScore = Math.max(0, 1 - distanceKm / 25); // 25km = 0 score cutoff
      const reliabilityScore = donor.reliabilityScore ?? 0.5;
      const finalScore = distanceScore * 0.6 + reliabilityScore * 0.4;

      return {
        ...donor,
        distanceKm: Number(distanceKm.toFixed(2)),
        matchScore: Number(finalScore.toFixed(3)),
      };
    })
  );

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Only the top N donors get notified first (avoids notifying everyone
 * and causing "donor fatigue").
 */
export function topDonorsToNotify(rankedDonors, n = 5) {
  return rankedDonors.slice(0, n);
}
