import React from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

function Sidebar({ setSelectedData }) {
  const handleItemClick = (dataType) => {
    setSelectedData(dataType);
  };

  return (
    <div className="sidebar">
      <Typography variant="h6">Food Security Monitoring</Typography>
      <List>
        <ListItem component="button" onClick={() => handleItemClick("country")}>
          <ListItemText primary="Country Information" />
        </ListItem>
        <ListItem component="button" onClick={() => handleItemClick("ipc")}>
          <ListItemText primary="IPC Data" />
        </ListItem>
        <ListItem component="button" onClick={() => handleItemClick("fcs")}>
          <ListItemText primary="Food Consumption Score" />
        </ListItem>
        <ListItem component="button" onClick={() => handleItemClick("climate")}>
          <ListItemText primary="Climate Data" />
        </ListItem>
        <ListItem component="button" onClick={() => handleItemClick("hazards")}>
          <ListItemText primary="Hazards Data" />
        </ListItem>
      </List>
    </div>
  );
}

export default Sidebar;
