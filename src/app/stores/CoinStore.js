import { createFilter } from 'react-search-input'

import Debug from 'debug'

import BaseStore from './BaseStore'
import AppDispatcher from '../dispatcher/Dispatcher'
import ActionTypes from '../constants/ActionTypes'

const debug = Debug('donut:store:coin')

const KEYS_TO_FILTERS = ['long', 'short']

class CoinStoreClass extends BaseStore {
  constructor () {
    super()
    this.coinMap = {}
    this.filterableArray = []
    this.arrayAlreadyFilled = false
  }

  getPriceInBTC (usd) {
    const btcToUSD = this.getCoinByID('BTC').price
    return usd / btcToUSD
  }

  getCoinByID (id) {
    return this.coinMap[id]
  }

  newTrade (trade) {
    this.coinMap[trade.coin] = trade.msg
  }

  getCoinIDs (query = '') {
    if (!query || query === '') {
      return this.filterableArray.map((coin) => coin.short)
    } else {
      const filteredCoins = this.filterableArray.filter(createFilter(query, KEYS_TO_FILTERS))
      return filteredCoins.map((coin) => coin.short)
    }
  }

  syncCoins (coins) {
    for (let coin of coins) {
      this.coinMap[coin.short] = coin

      if (!this.arrayAlreadyFilled) {
        let t = {}

        for (let key of KEYS_TO_FILTERS) {
          t[key] = coin[key]
        }

        this.filterableArray.push(t)
      }
    }

    if (!this.arrayAlreadyFilled) this.arrayAlreadyFilled = true
  }
}

const CoinStore = new CoinStoreClass()
CoinStore.setMaxListeners(1000)

const register = {
  [ ActionTypes.COIN_DATA ]: (data) => {
    CoinStore.syncCoins(data.coinData)
    CoinStore.emitChange()
  },
  [ ActionTypes.NEW_TRADE ]: (data) => {
    if (!data.trade) debug(data)
    else {
      CoinStore.newTrade(data.trade.message)
      CoinStore.emitChange()
    }
  }
}

AppDispatcher.register((payload) => {
  const type = payload.type
  const data = payload.data

  ;(register[type] || function () {})(data)
})

export default CoinStore
