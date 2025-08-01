import React, { useEffect, useState } from "react";
import LauncherList from "./components/launcherList";
import { LauncherItem } from "./types";

declare global {
  interface Window {
    launcherAPI: {
      getShortcuts: () => Promise<LauncherItem[]>;
    };
  }
}

const App: React.FC = () => {
  const [items, setItems] = useState<LauncherItem[]>([]);

  useEffect(() => {
    window.launcherAPI.getShortcuts().then(setItems);
  }, []);
  console.log(items);
  return (
    <div>
      <h1>macOS Launcher</h1>
      <LauncherList items={items} />
    </div>
  );
};

export default App;
