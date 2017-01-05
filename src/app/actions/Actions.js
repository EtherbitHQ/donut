/* global Notification */

import io from 'socket.io-client'

const { shell } = window.require('electron')

import ActionTypes from '../constants/ActionTypes'
import AppDispatcher from '../dispatcher/Dispatcher'

import api from '../utils/api'
import checkForUpdate from '../utils/checkForUpdate'
import pkg from '../../package.json'

const dispatchTrade = (trade) => {
  AppDispatcher.dispatch({
    type: ActionTypes.NEW_TRADE,
    data: {
      trade: trade
    }
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
      console.log('Connected to CoinCap server')

      AppDispatcher.dispatch({
        type: ActionTypes.ONLINE
      })
    })

    socket.on('trades', dispatchTrade)
    window.addEventListener('online', dispatchOnline)
    window.addEventListener('offline', dispatchOffline)
  },

  fetchCurrencyData () {
    console.log('Fetching currency data')

    api.currencyAPI((error, currencyData) => {
      if (error) throw new Error(error)

      console.log('Currency data fetched successfully')

      AppDispatcher.dispatch({
        type: ActionTypes.CURRENCY_DATA,
        data: {
          currencyData: currencyData
        }
      })
    })
  },

  fetchCoinData () {
    console.log('Fetching coin data')

    api.frontAPI((error, coinData) => {
      if (error) throw new Error(error)

      console.log('Coin map fetched successfully')

      AppDispatcher.dispatch({
        type: ActionTypes.COIN_DATA,
        data: {
          coinData: coinData
        }
      })
    })
  },

  checkForUpdate () {
    console.log('Checking for update')

    checkForUpdate((error, updateAvailable) => {
      if (error) throw new Error(error)

      console.log('Successfully checked for update')

      if (updateAvailable) {
        console.log('Update available', updateAvailable)

        const updateNotification = new Notification('New version available', {
          body: `Click here to download ${updateAvailable}. You have v${pkg.version}.`
        })

        updateNotification.onclick = () => shell.openExternal(`${pkg.repository}/releases/latest`)

        AppDispatcher.dispatch({
          type: ActionTypes.UPDATE_AVAILABLE,
          data: {
            newVersion: updateAvailable
          }
        })
      }
    })
  }
}
