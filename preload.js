const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('launcher', {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  close: () => ipcRenderer.invoke('window:close'),
  check: () => ipcRenderer.invoke('launcher:check'),
  start: () => ipcRenderer.invoke('launcher:start'),
  info: () => ipcRenderer.invoke('launcher:info'),
  onStatus: (callback) => ipcRenderer.on('launcher:status', (_event, data) => callback(data))
});
