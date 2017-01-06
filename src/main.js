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

if (platform === 'darwin' || platform === 'win32') {
  const menubar = require('menubar')

  const mb = menubar(Object.assign(browserWindowConfig, menuBarConfig))

  app.on('ready', () => {
    mb.tray.setTitle('Donut')

    ipcMain.on('update-btc-price', (event, { shortPrice, price, currency }) => {
      mb.tray.setTitle(`${shortPrice} ${currency}`)
      mb.tray.setToolTip(`${price} ${currency}`)
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
