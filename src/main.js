const os = require('os')
const path = require('path')
const { app, ipcMain } = require('electron')

const platform = os.platform()

// All platforms
const browserWindowConfig = {
  icon: path.join(__dirname, 'icon.png'),
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

let pos
let show = false

if (platform === 'darwin' || platform === 'win32') {
  const menubar = require('menubar')

  const mb = menubar(Object.assign(browserWindowConfig, menuBarConfig))

  const setIcon = () => {
    const icon = pos === undefined ? 'icon' : (pos ? 'up' : 'down')
    const suffix = show ? 'light' : 'dark'

    mb.tray.setImage(path.join(__dirname, `${icon}-${suffix}.png`))
  }

  app.on('ready', () => {
    mb.tray.setTitle('Donut')

    mb.on('show', () => {
      show = true
      setIcon()
    })

    mb.on('hide', () => {
      show = false
      setIcon()
    })

    ipcMain.on('update-menubar-title', (event, { coin, price, currency, positive }) => {
      pos = positive
      mb.tray.setTitle(`${coin} ${price} ${currency}`)
      setIcon()
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
