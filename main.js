/**
 * Created by paul on 29.12.15.
 */
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var globalShortcut = electron.globalShortcut;

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    var win = new BrowserWindow({
        width: 800,
        height: 600,
        //resizable: false,
        darkTheme: true
    });

    //webContents.reload(); перезагружает страничку
    win.loadUrl('file://' + __dirname + '/html/login.html');
    win.openDevTools();
    win.on('close', function() {
        win = null
    });

    var webContents = win.webContents;
    var printShortcut = globalShortcut.register('CmdOrCtrl+p', function() {
        webContents.print();
    });

});