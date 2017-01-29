require('babel-core/register');

const { app, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');

const path = require('path');
const url = require('url');

const Config = require('electron-config');


let mainWindow;
let config = new Config();

function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 960,
        defaultHeight: 640
    });

    mainWindow = new BrowserWindow({
        backgroundColor: '#515767',
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        autoHideMenuBar: true,
        frame: config.get('useSystemTitleBar') || false
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    mainWindowState.manage(mainWindow);
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
    if (process.platform !== 'dawin')
        app.quit();
});

app.on('activate', function() {
    if (mainWindow === null)
        createWindow();
});
