# Arco Design Pro for Electron

本项目为基于 `Arco Desgin Pro` 以及 `Electron` 组合而成，为解决 `Arco Design Pro` 跨平台桌面端问题

## 快速开始

```
// 初始化项目
npm install

// Electron 开发模式
npm run electron:serve

// 构建（完善中）
npm run electron:build
```

## 其他
* 代码中可直接使用 `window.ipcRenender` 以使用 `electron` 中 `ipcRenender` 的所有功能，`window.ipcRenender` 已经在 `preload.js` 中注入
* 其他有需要注入的内容请在 `preload.js` 中使用 `contextBridge` 进行注入，以保证上下文安全

## 相关链接
* [Arco Design Pro](https://github.com/arco-design/arco-design-pro)
