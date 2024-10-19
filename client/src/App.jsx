import React, { useState } from "react";
import MapComponent from "./components/Map";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [selectedData, setSelectedData] = useState("country");

  return (
    <div className="app">
      <Sidebar setSelectedData={setSelectedData} />
      <div className="map-container">
        <MapComponent selectedData={selectedData} />
      </div>
    </div>
  );
}

export default App;
