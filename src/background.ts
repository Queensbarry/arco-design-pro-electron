/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const path = require('path');
const {readFile} = require('fs');
// @ts-ignore
const {URL} = require('url');
const {app, ipcMain, protocol, BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');
const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

async function createWindow() {
  // Create the browser window
  const win = new BrowserWindow(
    {
      width: 1200,
      height: 650,
      minWidth: 1140,
      center: true,
      titleBarStyle: 'hidden',
      frame: false,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: true,
        contextIsolation: true,
        // preload
        preload: path.join(__dirname, 'preload.ts'),
      },
    }
  );

  if (isDev) {
    await win.loadURL('http://localhost:3000').then(() => {
      win.webContents.openDevTools();
    }).catch((e) => {
      console.error(`Window fail to load: ${e}`);
    });
  } else {
    createProtocol('app', null);
    // Load the index.html when not in development
    await win.loadURL('app://./index.html');
  }

  // bind some event
  ipcMain.on('minimize', () => {
    win.minimize();
  });
  ipcMain.on('maximize', () => {
    win.isMaximized() ? win.restore() : win.maximize();
  })
  ipcMain.on('quit', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
      app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  if (BrowserWindow.getAllWindows().length === 0) createWindow().then(() => {});
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDev) {
    // Install React and Redux Devtools
    try {
      await installExtension([
        REACT_DEVELOPER_TOOLS,
        REDUX_DEVTOOLS,
      ], {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      });
    } catch (e) {
      console.error(`Devtools failed to install: ${e}`);
    }
  }
  await createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDev) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    })
  }
}

function createProtocol(scheme, customProtocol) {
  (customProtocol || protocol).registerBufferProtocol(
    scheme,
    (request, respond) => {
      let pathName = new URL(request.url).pathname;
      // Needed in case URL contains spaces
      pathName = decodeURI(pathName);

      readFile(path.join(__dirname, pathName), (error, data) => {
        if (error) {
          console.error(
            `Failed to read ${pathName} on ${scheme} protocol`,
            error
          );
        }
        const extension = path.extname(pathName).toLowerCase();
        let mimeType = '';

        if (extension === '.js') {
          mimeType = 'text/javascript';
        } else if (extension === '.html') {
          mimeType = 'text/html';
        } else if (extension === '.css') {
          mimeType = 'text/css';
        } else if (extension === '.svg' || extension === '.svgz') {
          mimeType = 'image/svg+xml';
        } else if (extension === '.json') {
          mimeType = 'application/json';
        } else if (extension === '.wasm') {
          mimeType = 'application/wasm';
        }

        respond({ mimeType, data });
      });
    }
  )
}
