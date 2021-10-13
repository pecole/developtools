const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
    convertImage: async (data: any) => await ipcRenderer.invoke('convertImage', data)
}
);