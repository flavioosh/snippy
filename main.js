require('babel-core/register');

const { app, BrowserWindow } = require('electron');

const path = require('path');
const url = require('url');

const Config = require('electron-config');


let mainWindow;
let config = new Config();

function createWindow() {
    mainWindow = new BrowserWindow({
        backgroundColor: '#515767',
        width: 960,
        height: 640,
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
