/* eslint-disable @typescript-eslint/no-var-requires */
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)