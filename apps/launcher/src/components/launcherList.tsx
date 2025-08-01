import React from "react";
import { LauncherItem } from "../types";

interface LauncherListProps {
  items: LauncherItem[];
}

const LauncherList: React.FC<LauncherListProps> = ({ items }) => {
  const renderItem = (item: LauncherItem, index: number) => (
    <div
      className="launcher-item"
      key={index}
      onClick={() => handleLaunch(item.command)}
    >
      <img
        src={item.icon || "/default.png"}
        alt={item.name}
        className="launcher-icon"
      />
      <span className="launcher-name">{item.name}</span>
    </div>
  );

  const handleLaunch = (command: string) => {
    // Logic to launch the application using the command
    console.log(`Launching: ${command}`);
  };

  return <div className="launcher-list">{items.map(renderItem)}</div>;
};

export default LauncherList;
