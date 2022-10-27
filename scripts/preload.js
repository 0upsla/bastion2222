const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    'server', {
        getConfig: () => ipcRenderer.invoke('config'),
        sendGroup: () => ipcRenderer.invoke('sendGroup'),
        nextGroupNumber: () => ipcRenderer.invoke('nextGroupNumber')
    }
)