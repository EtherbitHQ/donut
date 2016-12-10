const os = require('os')
const path = require('path')
const { app, ipcMain } = require('electron')

const platform = os.platform()

const width = 360
const height = 600

if (platform === 'darwin' || platform === 'win32') {
  const menubar = require('menubar')

  const mb = menubar({
    preloadWindow: true,
    showDockIcon: false,
    icon: path.join(__dirname, 'icon.png'),
    width: width,
    height: height
  })

  mb.on('after-create-window', () => mb.window.setResizable(false))

  app.on('ready', () => {
    mb.tray.setTitle('Donut')

    ipcMain.on('update-btc-price', (event, price) => {
      mb.tray.setTitle(price)
    })
  })
} else {
  const { BrowserWindow } = require('electron')

  app.on('ready', () => {
    let win = new BrowserWindow({
      width: width,
      height: height,
      fullscreen: false,
      fullscreenable: false,
      resizable: false
    })

    win.on('closed', () => {
      win = null
    })

    win.loadURL(path.join('file://', __dirname, 'index.html'))
  })
}

ipcMain.on('quit', () => app.quit())
