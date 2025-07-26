const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('launcherAPI', {
  getShortcuts: () => ipcRenderer.invoke('get-shortcuts'),
});