import axios from "axios";
import apiConfig from "../configs/api";

/**
 * Public: Fetch summary list of events that have published results
 */
export const getPublishedResultsList = async () => {
  try {
    const res = await axios.get(`${apiConfig.url}/results`);
    return res.data;
  } catch (err) {
    console.error("Error fetching published results list:", err);
    return err?.response?.data || { error: "Failed to fetch results list." };
  }
};

/**
 * Public: Fetch detailed shortlisted teams for a specific event
 * @param {string} eventSlug e.g. 'hacknova', 'innowave'
 */
export const getEventResults = async (eventSlug) => {
  try {
    const res = await axios.get(`${apiConfig.url}/results/${eventSlug}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching results for ${eventSlug}:`, err);
    return err?.response?.data || { error: `Failed to fetch results for ${eventSlug}.` };
  }
};

/**
 * Admin: Fetch candidate list for an event with currently shortlisted IDs for a round
 * @param {string} eventSlug
 * @param {string} roundName
 */
export const getEventCandidates = async (eventSlug, roundName = "Round 1") => {
  try {
    const admin = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("admin") || "null") : null;
    if (!admin?.token) {
      return { error: "Admin authentication required." };
    }

    const res = await axios.get(`${apiConfig.url}/results/admin/candidates/${eventSlug}`, {
      params: { round_name: roundName },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admin.token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error(`Error fetching candidates for ${eventSlug}:`, err);
    return err?.response?.data || { error: `Failed to fetch candidates for ${eventSlug}.` };
  }
};

/**
 * Admin: Publish or update results for an event and round
 * @param {Object} payload { event_slug, round_name, shortlisted_team_ids }
 */
export const publishResults = async (payload) => {
  try {
    const admin = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("admin") || "null") : null;
    if (!admin?.token) {
      return { error: "Admin authentication required." };
    }

    const res = await axios.post(`${apiConfig.url}/results`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admin.token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error publishing results:", err);
    return err?.response?.data || { error: "Failed to publish results." };
  }
};

/**
 * Admin: Unpublish results for an event round
 * @param {Object} payload { event_slug, round_name }
 */
export const unpublishResults = async (payload) => {
  try {
    const admin = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("admin") || "null") : null;
    if (!admin?.token) {
      return { error: "Admin authentication required." };
    }

    const res = await axios.delete(`${apiConfig.url}/results`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admin.token}`,
      },
      data: payload,
    });
    return res.data;
  } catch (err) {
    console.error("Error unpublishing results:", err);
    return err?.response?.data || { error: "Failed to unpublish results." };
  }
};
