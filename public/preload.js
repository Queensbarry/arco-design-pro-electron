/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)

// expose version in react app
process.once('loaded', () => {
  contextBridge.exposeInMainWorld('versions', process.versions)
})