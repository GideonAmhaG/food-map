import axios from "axios";

const BASE_URL = "https://api.hungermapdata.org";

export const getCountryInfo = async () => {
  console.log("Fetching country info");
  try {
    const response = await axios.get(`${BASE_URL}/v2/info/country`);
    console.log("Country info response:", response.data);
    if (response.data && response.data.body && response.data.body.countries) {
      return {
        type: "FeatureCollection",
        features: response.data.body.countries.map((country) => ({
          type: "Feature",
          properties: {
            ...country,
            riskScore: Math.random() * 100, // Placeholder for risk score
          },
          geometry: null,
        })),
      };
    } else {
      console.error("Unexpected country data structure:", response.data);
      return { type: "FeatureCollection", features: [] };
    }
  } catch (error) {
    console.error("Error fetching country info:", error);
    throw error;
  }
};

export const getIpcData = async () => {
  console.log("Fetching IPC data");
  try {
    const response = await axios.get(`${BASE_URL}/v1/ipc/peaks`);
    console.log("IPC data response:", response.data);
    if (response.data && response.data.body) {
      return {
        type: "FeatureCollection",
        features: Object.entries(response.data.body).map(([key, value]) => ({
          type: "Feature",
          properties: { ...value, id: key },
          geometry: null,
        })),
      };
    } else {
      console.error("Unexpected IPC data structure:", response.data);
      return { type: "FeatureCollection", features: [] };
    }
  } catch (error) {
    console.error("Error fetching IPC data:", error);
    throw error;
  }
};

export const getFcsData = async () => {
  console.log("Fetching FCS data");
  try {
    const response = await axios.get(`${BASE_URL}/v1/foodsecurity/country`);
    return {
      type: "FeatureCollection",
      features: Object.entries(response.data).map(([country, data]) => ({
        type: "Feature",
        properties: { country, ...data },
        geometry: null,
      })),
    };
  } catch (error) {
    console.error("Error fetching FCS data:", error);
    throw error;
  }
};

export const getClimateData = async () => {
  console.log("Fetching climate data");
  try {
    const response = await axios.get(`${BASE_URL}/v2/climate/country`);
    console.log("Climate data response:", response.data);
    if (response.data && typeof response.data === "object") {
      return {
        type: "FeatureCollection",
        features: Object.entries(response.data).map(([key, value]) => ({
          type: "Feature",
          properties: { ...value, id: key },
          geometry: null,
        })),
      };
    } else {
      console.error("Unexpected climate data structure:", response.data);
      return { type: "FeatureCollection", features: [] };
    }
  } catch (error) {
    console.error("Error fetching climate data:", error);
    throw error;
  }
};

export const getHazardsData = async () => {
  console.log("Fetching hazards data");
  try {
    const response = await axios.get(`${BASE_URL}/v1/climate/hazards`);
    console.log("Hazards data response:", response.data);
    if (response.data && typeof response.data === "object") {
      return {
        type: "FeatureCollection",
        features: Object.entries(response.data).map(([key, value]) => ({
          type: "Feature",
          properties: { ...value, id: key },
          geometry: null,
        })),
      };
    } else {
      console.error("Unexpected hazards data structure:", response.data);
      return { type: "FeatureCollection", features: [] };
    }
  } catch (error) {
    console.error("Error fetching hazards data:", error);
    throw error;
  }
};
