import {createFilter} from 'react-search-input'

import BaseStore from './BaseStore'
import AppDispatcher from '../dispatcher/Dispatcher'
import { ActionTypes } from '../constants/Constants'

const KEYS_TO_FILTERS = ['id', 'symbol']

class CoinStoreClass extends BaseStore {
  constructor () {
    super()
    this.coins = {}
    this.filterableArray = []
    this.arrayAlreadyFilled = false
  }

  getCoinByID (id) {
    return this.coins[id]
  }

  getCoinIDs (query = '') {
    console.log(query)
    if (!query || query === '') {
      return this.filterableArray.map((coin) => coin.id)
    } else {
      const filteredCoins = this.filterableArray.filter(createFilter(query, KEYS_TO_FILTERS))
      return filteredCoins.map((coin) => coin.id)
    }
  }

  syncCoins (coins) {
    for (let coin of coins) {
      this.coins[coin.id] = coin

      if (!this.arrayAlreadyFilled) {
        this.filterableArray.push({
          id: coin.id,
          symbol: coin.symbol,
          rank: coin.rank
        })
      }
    }

    if (!this.arrayAlreadyFilled) {
      this.filterableArray.sort((a, b) => a.rank - b.rank)
      this.arrayAlreadyFilled = true
    }
  }
}

const coinStore = new CoinStoreClass()
coinStore.setMaxListeners(1000)

const register = {
  [ ActionTypes.COIN_DATA ]: (data) => {
    coinStore.syncCoins(data.coins)
    coinStore.emitChange()
  }
}

AppDispatcher.register((payload) => {
  const type = payload.type
  const data = payload.data

  ;(register[type] || function () {})(data)
})

export default coinStore
