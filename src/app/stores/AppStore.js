import BaseStore from './BaseStore'
import AppDispatcher from '../dispatcher/Dispatcher'
import ActionTypes from '../constants/ActionTypes'

import Actions from '../actions/Actions'

class AppStoreClass extends BaseStore {
  constructor () {
    super()
    this.online = false
    this.currencyDataAvailable = false
    this.coinDataAvailable = false
  }

  isOnline () {
    return this.online
  }

  setOnline () {
    if (!this.currencyDataAvailable) Actions.fetchCurrencyData()
    if (!this.coinDataAvailable) Actions.fetchCoinData()

    this.online = true
  }

  setOffline () {
    this.online = false
  }

  gotCurrencyData () {
    this.currencyDataAvailable = true
  }

  gotCoinData () {
    this.coinDataAvailable = true
  }
}

const AppStore = new AppStoreClass()

const register = {
  [ ActionTypes.ONLINE ]: (data) => {
    AppStore.setOnline()
    AppStore.emitChange()
  },
  [ ActionTypes.OFFLINE ]: (data) => {
    AppStore.setOffline()
    AppStore.emitChange()
  },
  [ ActionTypes.CURRENCY_DATA ]: (data) => {
    AppStore.gotCurrencyData()
    AppStore.emitChange()
  },
  [ ActionTypes.COIN_DATA ]: (data) => {
    AppStore.gotCoinData()
    AppStore.emitChange()
  }
}

AppDispatcher.register((payload) => {
  const type = payload.type
  const data = payload.data

  ;(register[type] || function () {})(data)
})

export default AppStore
