import BaseStore from './BaseStore'
import AppDispatcher from '../dispatcher/Dispatcher'
import ActionTypes from '../constants/ActionTypes'

class CurrencyStoreClass extends BaseStore {
  constructor () {
    super()
    this.currencyMap = {}
    this.selectedCurrency = 'USD'
    this.selectedCoin = 'BTC'
  }

  getCurrencies () {
    return Object.keys(this.currencyMap)
  }

  syncCurrencies (currencies) {
    this.currencyMap = Object.assign({
      BTC: 1,
      USD: 1
    }, currencies)
  }

  getSelectedCoin () {
    return this.selectedCoin
  }

  setSelectedCoin (coin) {
    this.selectedCoin = coin
  }

  setSelectedCurrency (currency) {
    this.selectedCurrency = currency
  }

  getSelectedCurrency () {
    return this.selectedCurrency
  }

  getSelectedCurrencyValue () {
    return this.currencyMap[this.selectedCurrency]
  }

  getPriceInSelectedCurrency (price) {
    return this.currencyMap[this.selectedCurrency] * price
  }
}

const CurrencyStore = new CurrencyStoreClass()
CurrencyStore.setMaxListeners(1000)

const register = {
  [ ActionTypes.CURRENCY_DATA ]: (data) => {
    CurrencyStore.syncCurrencies(data.currencyData.rates)
    CurrencyStore.emitChange()
  },
  [ ActionTypes.SELECT_CURRENCY ]: (data) => {
    CurrencyStore.setSelectedCurrency(data.selectedCurrency)
    CurrencyStore.emitChange()
  },
  [ ActionTypes.SELECT_COIN ]: (data) => {
    CurrencyStore.setSelectedCoin(data.coin)
    CurrencyStore.emitChange()
  }
}

AppDispatcher.register((payload) => {
  const type = payload.type
  const data = payload.data

  ;(register[type] || function () {})(data)
})

export default CurrencyStore
