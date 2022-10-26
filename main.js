const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const Fs = require("fs/promises")
const fs_extra = require("fs-extra")
const homeDir = require('os').homedir();
const {parseTime} = require('./scripts/utils');
const { machine } = require('os');


const default_config = {
    "input_directory_path": path.join(homeDir, "Desktop/dossier1"),
    "output_directory_path": path.join(homeDir, "Desktop/dossier2"),
    "start_time": "18:55",
    "end_pause_time": "21:55",
    "time_between_group": 300
}

let sample_data = path.join(homeDir, "Desktop/dossier0");

async function loadConfig() {
    
    let config = {};
    try{
        const json = await Fs.readFile('./config.json');
        if(json !== undefined){
        config = JSON.parse(json)
        }
    } catch {}
    config = Object.assign({}, default_config, config)
    return config
}

function saveConfig(config){
    let json = JSON.stringify(config, null, 4);
    Fs.writeFile('./config.json', json, {encoding:'utf8',flag:'w'});
}

let config = default_config;
let nextGroupNumber = 1;
loadConfig().then((c) => {
    config = c;
    saveConfig(config);
})


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'scripts/preload.js'),
            nodeIntegration: true,
        }
    })
    ipcMain.handle('config', () => config)
    ipcMain.handle('sendGroup', () => sendGroup())
    win.loadFile('index.html')
}

async function moveFiles(name){
    const matchedFiles = []

    const files = await Fs.readdir(config.input_directory_path);
    for(const file of files){
        const filename = path.parse(file).name
        if(filename.endsWith(name)){
            matchedFiles.push(filename)
            fs_extra.move(
                path.join(config.input_directory_path, file),
                path.join(config.output_directory_path, file),
                function(err){
                    if(err) return console.log(err)
                    console.log(filename)
                }
            )
        }
    }

    for(const file of files){

    }
}

function sendGroup(){
    let nexts = [
        100 + nextGroupNumber, 
        200 + nextGroupNumber,
        300 + nextGroupNumber, 
        400 + nextGroupNumber
    ]
    for(let n of nexts){
        moveFiles(n + "")
    }

    nextGroupNumber++

    return nexts
}

app.whenReady().then(() => {
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })