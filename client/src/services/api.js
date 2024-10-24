import axios from "axios";
import africaGeoJSON from "../data/africa_shape.json";

const BASE_URL =
  "https://api.allorigins.win/raw?url=https://api.hungermapdata.org";

export const getCountryBoundaries = () => {
  return africaGeoJSON;
};

export const getCountryInfo = async () => {
  console.log("Fetching country info");
  try {
    const [hungerMapResponse, restCountriesResponse] = await Promise.all([
      axios.get(`${BASE_URL}/v2/info/country`),
      axios.get("https://restcountries.com/v3.1/all?fields=name,cca3,latlng"),
    ]);

    if (hungerMapResponse.data?.body?.countries) {
      const allCountries = hungerMapResponse.data.body.countries;

      const countryCoordinates = restCountriesResponse.data.reduce(
        (acc, country) => {
          acc[country.cca3] = country.latlng;
          return acc;
        },
        {}
      );

      const getRiskScore = (incomeGroup) => {
        switch (incomeGroup) {
          case "LOW":
            return 80;
          case "LOWMID":
            return 60;
          case "UPMID":
            return 40;
          case "HIGH":
            return 20;
          default:
            return null;
        }
      };

      const features = allCountries.map((country) => {
        const coordinates = countryCoordinates[country.country?.iso3];
        const riskScore = getRiskScore(country.income_group?.level);

        return {
          type: "Feature",
          properties: {
            id: country.country?.iso3,
            name: country.country?.name,
            population: country.population?.number,
            incomeGroup: country.income_group?.level,
            riskScore: riskScore,
          },
          geometry: coordinates
            ? {
                type: "Point",
                coordinates: [coordinates[1], coordinates[0]],
              }
            : null,
        };
      });

      const africanCountries = africaGeoJSON.features
        .filter(
          (feature) =>
            feature.properties && feature.properties.name && feature.id
        )
        .map((feature) => {
          const country = allCountries.find(
            (c) =>
              c.country?.iso3 === feature.id ||
              c.country?.iso3 === feature.properties?.iso3 ||
              c.country?.iso2 === feature.properties?.iso2 ||
              (c.country?.name &&
                feature.properties?.name &&
                c.country.name.toLowerCase() ===
                  feature.properties.name.toLowerCase()) ||
              (c.country?.name &&
                feature.properties?.["country-abbrev"] &&
                c.country.name.toLowerCase() ===
                  feature.properties["country-abbrev"].toLowerCase())
          );
          const riskScore = country
            ? getRiskScore(country.income_group?.level)
            : null;

          // console.log(`African country: ${feature.properties.name}`);
          // console.log(`Matched country:`, country);
          // console.log(`Risk Score:`, riskScore);

          return {
            ...feature,
            properties: {
              ...feature.properties,
              id:
                country?.country?.iso3 ||
                feature.id ||
                feature.properties?.iso3,
              name: country?.country?.name || feature.properties?.name,
              population: country?.population?.number,
              incomeGroup: country?.income_group?.level,
              riskScore: riskScore,
            },
          };
        });
      return {
        type: "FeatureCollection",
        features: [...africanCountries, ...features],
      };
    } else {
      console.error(
        "Unexpected country data structure:",
        hungerMapResponse.data
      );
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
    const ipcPeaks = response.data?.body?.ipc_peaks;

    if (ipcPeaks) {
      return {
        type: "FeatureCollection",
        features: ipcPeaks.map((country) => {
          let ipcPhase = 1; // Default to IPC Phase 1
          if (country.phase_5_number > 0) {
            ipcPhase = 5;
          } else if (country.phase_4_number > 0) {
            ipcPhase = 4;
          } else if (country.phase_3_number > 0) {
            ipcPhase = 3;
          } else if (country.phase_2_number > 0) {
            ipcPhase = 2;
          }

          return {
            type: "Feature",
            properties: {
              id: country.iso3,
              name: country.country_name,
              ipcPhase: ipcPhase,
              populationAffected: country.analyzed_population_number,
            },
            geometry: null,
          };
        }),
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
