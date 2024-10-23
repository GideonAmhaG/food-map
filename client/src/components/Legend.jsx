import React from "react";

const Legend = ({ selectedData }) => {
  const getLegendItems = () => {
    switch (selectedData) {
      case "country":
        return [
          { color: "#cccccc", label: "No data" },
          { color: "#00ff00", label: "Low risk (0-25)" },
          { color: "#ffff00", label: "Medium risk (26-50)" },
          { color: "#ffa500", label: "High risk (51-75)" },
          { color: "#ff0000", label: "Very high risk (76-100)" },
        ];
      case "ipc":
        return [
          { color: "#00ff00", label: "IPC 1 - Minimal" },
          { color: "#ffff00", label: "IPC 2 - Stressed" },
          { color: "#ffa500", label: "IPC 3 - Crisis" },
          { color: "#ff0000", label: "IPC 4 - Emergency" },
          { color: "#8b0000", label: "IPC 5 - Famine" },
        ];
      case "fcs":
        return [
          { color: "#00ff00", label: "Acceptable (> 35)" },
          { color: "#ffa500", label: "Borderline (21.5 - 35)" },
          { color: "#ff0000", label: "Poor (≤ 21)" },
        ];
      case "climate":
        return [
          { color: "#00ff00", label: "Low risk" },
          { color: "#ffa500", label: "Medium risk" },
          { color: "#ff0000", label: "High risk" },
        ];
      case "hazards":
        return [
          { color: "#00ff00", label: "Low severity" },
          { color: "#ffa500", label: "Medium severity" },
          { color: "#ff0000", label: "High severity" },
        ];
      default:
        return [];
    }
  };

  const legendItems = getLegendItems();

  return (
    <div
      className="legend"
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 1000,
      }}
    >
      <h4>{selectedData.toUpperCase()} Legend</h4>
      {legendItems.map((item, index) => (
        <div
          key={index}
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: item.color,
              marginRight: "5px",
            }}
          ></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
