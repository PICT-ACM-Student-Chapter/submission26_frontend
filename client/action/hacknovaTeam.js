import axios from "axios";
import apiConfig from "../configs/api";

export const getHackNovaTeamMe = async () => {
  const submission = JSON.parse(localStorage.getItem("submission"));
  if (!submission || !submission.token) {
    return { error: "User is not authenticated. Please log in." };
  }

  const options = {
    method: "GET",
    url: `${apiConfig.url}/hacknova/team/me`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${submission.token}`,
    },
  };

  try {
    const res = await axios(options);
    return res.data;
  } catch (e) {
    console.error("Error in getHackNovaTeamMe:", e);
    if (e?.response?.data) {
      return e.response.data;
    }
    return { error: "Failed to fetch HackNova team details." };
  }
};

export const getHackNovaTeamStatus = async () => {
  const submission = JSON.parse(localStorage.getItem("submission"));
  if (!submission || !submission.token) {
    return { error: "User is not authenticated. Please log in." };
  }

  const options = {
    method: "GET",
    url: `${apiConfig.url}/hacknova/team/status`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${submission.token}`,
    },
  };

  try {
    const res = await axios(options);
    return res.data;
  } catch (e) {
    console.error("Error in getHackNovaTeamStatus:", e);
    if (e?.response?.data) {
      return e.response.data;
    }
    return { error: "Failed to fetch HackNova team status." };
  }
};

export const postHackNovaTeam = async (payload) => {
  const submission = JSON.parse(localStorage.getItem("submission"));
  if (!submission || !submission.token) {
    return { error: "User is not authenticated. Please log in." };
  }

  const options = {
    method: "POST",
    url: `${apiConfig.url}/hacknova/team`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${submission.token}`,
    },
    data: payload,
  };

  try {
    const res = await axios(options);
    return res.data;
  } catch (e) {
    console.error("Error in postHackNovaTeam:", e);
    if (e?.response?.data) {
      return e.response.data;
    }
    return { error: "Failed to register HackNova team." };
  }
};

/**
 * Public check for HackNova Squad Registrations portal status (Event ID 200, Route /hacknova-team)
 * Distinguishes squad formation from project submission (Event ID 20, Route /hacknova)
 */
export const getHackNovaSquadRegistrationStatus = async () => {
  try {
    const res = await axios.get(`${apiConfig.url}/submission/hacknova-team`);
    return {
      status: Boolean(res.data?.status || res.data?.is_active),
      is_active: Boolean(res.data?.status || res.data?.is_active),
      event_name: res.data?.event_name || "HACKNOVA SQUAD REGISTRATIONS",
      event_id: res.data?.event_id || 200,
    };
  } catch (e) {
    console.error("Error in getHackNovaSquadRegistrationStatus:", e);
    return { status: false, is_active: false };
  }
};
