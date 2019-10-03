var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');

var cheerio = require('cheerio');
var exp = express();
var tickets = require('./getTickets.js');

const { app, BrowserWindow } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 500,
    height: 250,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.htm')

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

var scriptLocation = __dirname +'/public/test-scripts';

exp.use(logRequest);
exp.use(setCORSHeaders);
exp.use(express.json());
exp.use(express.urlencoded({
  extended: true
}));

exp.use('/test-scripts/', express.static(scriptLocation));
exp.use(express.static(__dirname + '/public'));

exp.use('/list-scripts', function (req, res) {
  fs.readdir(scriptLocation, function (err, files) {
    if (err) {
      return console.error(err);
    }
    console.log('/list-scripts results');
    console.log(files);
    res.send(files);

  });
});

// tickets.getBugzilla(app, request, cheerio);

exp.use('/', function (req, res) {
  res.sendFile(__dirname + '/public/QAToolsMarkup.htm');
});

function logRequest(req, res, next) {
  console.log(' [%s] %s', req.method, req.url);

  next();
}

function setCORSHeaders(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  next();
}

var httpServer = http.createServer(exp);

httpServer.listen(8080);
console.log('server started on port 8080');