const os = require('os')
const path = require('path')
const { app, ipcMain } = require('electron')

const platform = os.platform()

let pos
let show = false

const getIcon = () => {
  const icon = pos === undefined ? 'icon' : (pos ? 'up' : 'down')
  const type = show ? 'light' : 'dark'

  return path.join(__dirname, 'icons', type, `${icon}.png`)
}

// All platforms
const browserWindowConfig = {
  icon: getIcon(),
  width: 360,
  height: 600,
  alwaysOnTop: platform === 'win32',
  fullscreen: false,
  fullscreenable: false,
  resizable: false
}

// Menubar (For macOS and Windows)
const menuBarConfig = {
  preloadWindow: true,
  showDockIcon: false
}

if (platform === 'darwin' || platform === 'win32') {
  const menubar = require('menubar')

  const mb = menubar(Object.assign(browserWindowConfig, menuBarConfig))

  app.on('ready', () => {
    mb.tray.setTitle('Donut')

    mb.on('show', () => {
      show = true
      mb.tray.setImage(getIcon())
    })

    mb.on('hide', () => {
      show = false
      mb.tray.setImage(getIcon())
    })

    ipcMain.on('update-menubar-title', (event, { coin, price, currency, positive }) => {
      pos = positive
      mb.tray.setTitle(`${coin} ${price} ${currency}`)
      mb.tray.setImage(getIcon())
    })
  })
} else {
  const { BrowserWindow } = require('electron')

  app.on('ready', () => {
    let win = new BrowserWindow(browserWindowConfig)

    win.on('closed', () => {
      win = null
    })

    win.loadURL(path.join('file://', __dirname, 'index.html'))
  })
}

ipcMain.on('quit', () => app.quit())
