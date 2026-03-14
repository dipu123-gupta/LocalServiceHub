import Booking from "../models/Booking.js";

/**
 * Calculates a surge multiplier based on booking density in the last 2 hours
 * and time of day.
 *
 * @param {string} city - The city to check demand in
 * @param {string} categoryId - The service category ID
 * @returns {object} - { multiplier, reason }
 */
export const getSurgeMultiplier = async (city, categoryId) => {
  let multiplier = 1.0;
  let reasons = [];

  // 1. Time-based Surge (Night Shift: 11 PM - 6 AM)
  const hour = new Date().getHours();
  if (hour >= 23 || hour < 6) {
    multiplier += 0.2; // +20%
    reasons.push("Late Night Service");
  }

  // 2. Demand-based Surge (Last 2 hours in this city/category)
  if (city && categoryId) {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const recentBookingCount = await Booking.countDocuments({
      "address.city": city,
      category: categoryId,
      createdAt: { $gte: twoHoursAgo },
    });

    if (recentBookingCount >= 20) {
      multiplier += 0.5; // +50%
      reasons.push("Critical High Demand");
    } else if (recentBookingCount >= 10) {
      multiplier += 0.25; // +25%
      reasons.push("High Demand in your area");
    } else if (recentBookingCount >= 5) {
      multiplier += 0.1; // +10%
      reasons.push("Slightly higher demand than usual");
    }
  }

  // Cap multiplier at 2.0x
  multiplier = Math.min(multiplier, 2.0);

  return {
    multiplier: parseFloat(multiplier.toFixed(2)),
    reason: reasons.length > 0 ? reasons.join(" & ") : null,
  };
};
