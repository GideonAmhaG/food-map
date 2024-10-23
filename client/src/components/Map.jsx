import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  getCountryInfo,
  getIpcData,
  getFcsData,
  getClimateData,
  getHazardsData,
} from "../services/api";
import Legend from "./Legend";
import LoadingSpinner from "./LoadingSpinner";
import africaGeoJSON from "../data/africa_shape.json";

function MapComponent({ selectedData }) {
  const [mapData, setMapData] = useState(null);
  console.log("mapData:", mapData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let data;
        console.log("Fetching data for:", selectedData);
        switch (selectedData) {
          case "country":
            data = await getCountryInfo();
            break;
          case "ipc":
            data = await getIpcData();
            break;
          case "fcs":
            data = await getFcsData();
            break;
          case "climate":
            data = await getClimateData();
            break;
          case "hazards":
            data = await getHazardsData();
            break;
          default:
            data = null;
        }
        console.log("Processed data:", data);
        if (!data || !data.features || data.features.length === 0) {
          console.error(`No ${selectedData} data available:`, data);
          throw new Error(`No ${selectedData} data available`);
        }
        setMapData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          `Failed to fetch ${selectedData} data. Please try again later. Error: ${err.message}`
        );
        setMapData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedData]);

  const getStyle = (feature) => {
    const baseStyle = {
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };

    if (!feature.properties) {
      console.log("No properties for feature:", feature);
      return baseStyle;
    }

    let fillColor;
    switch (selectedData) {
      case "country":
        const riskScore = feature.properties.riskScore;
        const countryName = feature.properties.name;
        console.log("Feature:", countryName, "Risk Score:", riskScore);

        if (riskScore === undefined) {
          console.log("No matching feature found for", countryName);
          fillColor = "#cccccc";
        } else {
          fillColor = getCountryColor(riskScore);
        }
        break;
      case "ipc":
        fillColor = getIpcColor(feature.properties.ipcPhase);
        break;
      case "fcs":
        fillColor = getFcsColor(feature.properties.fcs);
        break;
      case "climate":
        fillColor = getClimateColor(feature.properties.climateRisk);
        break;
      case "hazards":
        fillColor = getHazardColor(feature.properties.severity);
        break;
      default:
        fillColor = "#cccccc";
    }
    console.log("Fill color for", feature.properties.name, ":", fillColor);
    return {
      ...baseStyle,
      fillColor: fillColor,
    };
  };

  const getIpcColor = (ipcPhase) => {
    const colors = ["#00ff00", "#ffff00", "#ffa500", "#ff0000", "#8b0000"];
    return colors[ipcPhase - 1] || "#cccccc";
  };

  const getFcsColor = (fcs) => {
    if (fcs === undefined) return "#cccccc";
    if (fcs <= 21) return "#ff0000";
    if (fcs <= 35) return "#ffa500";
    return "#00ff00";
  };

  const getClimateColor = (risk) => {
    if (risk === undefined) return "#cccccc";
    if (risk === "high") return "#ff0000";
    if (risk === "medium") return "#ffa500";
    return "#00ff00";
  };

  const getHazardColor = (severity) => {
    if (severity === undefined) return "#cccccc";
    if (severity === "high") return "#ff0000";
    if (severity === "medium") return "#ffa500";
    return "#00ff00";
  };

  const getCountryColor = (riskScore) => {
    if (riskScore === null || riskScore === undefined) return "#cccccc";
    riskScore = Number(riskScore);
    if (isNaN(riskScore)) return "#cccccc";
    if (riskScore <= 25) return "#00ff00";
    if (riskScore <= 50) return "#ffff00";
    if (riskScore <= 75) return "#ffa500";
    return "#ff0000";
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindTooltip(() => getTooltipContent(feature.properties), {
        sticky: true,
      });
    }
  };

  const getTooltipContent = (properties) => {
    switch (selectedData) {
      case "country":
        return `
          <strong>${properties.name || properties.id || "Unknown"}</strong><br/>
          Population: ${
            properties.population
              ? properties.population.toLocaleString()
              : "N/A"
          }<br/>
          Income Group: ${properties.incomeGroup || "N/A"}
        `;
      case "ipc":
        return `
          <strong>${properties.id}</strong><br/>
          IPC Phase: ${properties.ipcPhase || "N/A"}<br/>
          Population Affected: ${
            properties.populationAffected
              ? properties.populationAffected.toLocaleString()
              : "N/A"
          }
        `;
      case "fcs":
        return `
          <strong>${properties.country}</strong><br/>
          FCS: ${properties.fcs ? properties.fcs.toFixed(2) : "N/A"}<br/>
          Insufficient Food Consumption: ${
            properties.insufficientFoodConsumption
              ? (properties.insufficientFoodConsumption * 100).toFixed(2) + "%"
              : "N/A"
          }<br/>
          Crisis or Above Coping: ${
            properties.crisisOrAboveCoping
              ? (properties.crisisOrAboveCoping * 100).toFixed(2) + "%"
              : "N/A"
          }
        `;
      case "climate":
        return `
          <strong>${properties.id}</strong><br/>
          Hydric Stress: ${
            properties.hydricStress
              ? (properties.hydricStress.prevalence * 100).toFixed(2) + "%"
              : "N/A"
          }<br/>
          Vegetation Stress: ${
            properties.vegetationStress
              ? (properties.vegetationStress.prevalence * 100).toFixed(2) + "%"
              : "N/A"
          }
        `;
      case "hazards":
        return `
          <strong>${properties.id}</strong><br/>
          Event: ${properties.event || "N/A"}<br/>
          Type: ${properties.type || "N/A"}<br/>
          Severity: ${properties.severity || "N/A"}
        `;
      default:
        return "";
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {isLoading && <LoadingSpinner />}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            color: "red",
          }}
        >
          {error}
        </div>
      )}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        minZoom={2}
        maxZoom={10}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          errorTileUrl="https://via.placeholder.com/256x256?text=Map+Tile+Unavailable"
        />
        {/* Fallback tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {africaGeoJSON && mapData && (
          <GeoJSON
            key={`africa-${selectedData}`}
            data={africaGeoJSON}
            style={(feature) => {
              const matchingFeature = mapData.features.find(
                (f) => f.properties.id === feature.properties.id
              );
              if (matchingFeature) {
                console.log(
                  "Matching feature found for",
                  feature.properties.name
                );
                feature.properties = {
                  ...feature.properties,
                  ...matchingFeature.properties,
                };
              } else {
                console.log(
                  "No matching feature found for",
                  feature.properties.name
                );
              }
              return getStyle(feature);
            }}
            onEachFeature={onEachFeature}
          />
        )}
        {mapData && mapData.features && mapData.features.length > 0 && (
          <GeoJSON
            key={`countries-${selectedData}`}
            data={mapData}
            pointToLayer={(feature, latlng) => {
              const style = getStyle(feature);
              return L.circleMarker(latlng, {
                ...style,
                radius: 8,
              });
            }}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
      {mapData && !mapData.features.some((feature) => feature.geometry) && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1000,
            background: "white",
            padding: 10,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h3>Country Information</h3>
          <ul>
            {mapData.features.map((feature, index) => (
              <li
                key={index}
                dangerouslySetInnerHTML={{
                  __html: getTooltipContent(feature.properties),
                }}
              />
            ))}
          </ul>
        </div>
      )}
      <Legend selectedData={selectedData} />
    </div>
  );
}

export default MapComponent;
