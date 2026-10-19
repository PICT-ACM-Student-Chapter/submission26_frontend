import axios from "axios";
import apiConfig from "../configs/api";

export const getInnoWaveTeamMe = async () => {
  const submission = JSON.parse(localStorage.getItem("submission"));
  if (!submission || !submission.token) {
    return { error: "User is not authenticated. Please log in." };
  }

  const options = {
    method: "GET",
    url: `${apiConfig.url}/innowave/team/me`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${submission.token}`,
    },
  };

  try {
    const res = await axios(options);
    return res.data;
  } catch (e) {
    console.error("Error in getInnoWaveTeamMe:", e);
    if (e?.response?.data) {
      return e.response.data;
    }
    return { error: "Failed to fetch InnoWave team details." };
  }
};

export const getInnoWaveTeamStatus = async () => {
  const submission = JSON.parse(localStorage.getItem("submission"));
  if (!submission || !submission.token) {
    return { error: "User is not authenticated. Please log in." };
  }

  const options = {
    method: "GET",
    url: `${apiConfig.url}/innowave/team/status`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${submission.token}`,
    },
  };

  try {
    const res = await axios(options);
    return res.data;
  } catch (e) {
    console.error("Error in getInnoWaveTeamStatus:", e);
    if (e?.response?.data) {
      return e.response.data;
    }
    return { error: "Failed to fetch InnoWave team status." };
  }
};

export const postInnoWaveTeam = async (payload) => {
  const submission = JSON.parse(localStorage.getItem("submission"));
  if (!submission || !submission.token) {
    return { error: "User is not authenticated. Please log in." };
  }

  const options = {
    method: "POST",
    url: `${apiConfig.url}/innowave/team`,
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
    console.error("Error in postInnoWaveTeam:", e);
    if (e?.response?.data) {
      return e.response.data;
    }
    return { error: "Failed to register InnoWave team." };
  }
};

/**
 * Public check for InnoWave Team Registrations portal status (Event ID 201, Route /innowave-team)
 * Distinguishes team formation from idea deck submission (Event ID 12, Route /innowave)
 */
export const getInnoWaveTeamRegistrationStatus = async () => {
  try {
    const res = await axios.get(`${apiConfig.url}/submission/innowave-team`);
    return {
      status: Boolean(res.data?.status || res.data?.is_active),
      is_active: Boolean(res.data?.status || res.data?.is_active),
      event_name: res.data?.event_name || "INNOWAVE TEAM REGISTRATIONS",
      event_id: res.data?.event_id || 201,
    };
  } catch (e) {
    console.error("Error in getInnoWaveTeamRegistrationStatus:", e);
    return { status: false, is_active: false };
  }
};
