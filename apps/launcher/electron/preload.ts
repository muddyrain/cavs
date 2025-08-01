import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("launcherAPI", {
	getShortcuts: () => ipcRenderer.invoke("get-shortcuts")
})
