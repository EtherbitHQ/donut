/* global Notification */

import io from 'socket.io-client'

import Debug from 'debug'
import CheckForUpdate from 'check-for-update'

import ActionTypes from '../constants/ActionTypes'
import AppDispatcher from '../dispatcher/Dispatcher'
import api from '../utils/api'

const { shell } = window.require('electron')
const debug = Debug('donut:actions')

const dispatchTrade = (trade) => {
  AppDispatcher.dispatch({
    type: ActionTypes.NEW_TRADE,
    data: { trade }
  })
}

const dispatchOnline = () => {
  AppDispatcher.dispatch({
    type: ActionTypes.ONLINE
  })
}

const dispatchOffline = () => {
  AppDispatcher.dispatch({
    type: ActionTypes.OFFLINE
  })
}

export default {
  initSocketConnection () {
    let socket = io.connect('http://coincap.io')

    socket.on('connect', () => {
      debug('Connected to CoinCap server')

      AppDispatcher.dispatch({
        type: ActionTypes.ONLINE
      })
    })

    socket.on('trades', dispatchTrade)
    window.addEventListener('online', dispatchOnline)
    window.addEventListener('offline', dispatchOffline)
  },

  fetchCurrencyData () {
    debug('Fetching currency data')

    api.currencyAPI((error, currencyData) => {
      if (error) throw new Error(error)

      debug('Currency data fetched successfully')

      AppDispatcher.dispatch({
        type: ActionTypes.CURRENCY_DATA,
        data: { currencyData }
      })
    })
  },

  fetchCoinData () {
    debug('Fetching coin data')

    api.frontAPI((error, coinData) => {
      if (error) throw new Error(error)

      debug('Coin map fetched successfully')

      AppDispatcher.dispatch({
        type: ActionTypes.COIN_DATA,
        data: { coinData }
      })
    })
  },

  checkForUpdate () {
    const cfu = new CheckForUpdate({
      packageJSON: require('../../package.json'),
      checkOnLaunch: true,
      intervalHrs: 12
    })

    cfu.on('update_available', ({ currentVersion, newVersion, repoURL, updateURL }) => {
      debug('Update available', newVersion)

      const updateNotification = new Notification('New version available', {
        body: `Click here to download v${newVersion}. You have v${currentVersion}.`
      })

      updateNotification.onclick = () => shell.openExternal(updateURL)

      AppDispatcher.dispatch({
        type: ActionTypes.UPDATE_AVAILABLE,
        data: { newVersion }
      })
    })

    cfu.start()
  }
}
