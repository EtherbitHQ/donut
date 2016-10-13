import { ActionTypes } from '../constants/Constants'
import AppDispatcher from '../dispatcher/Dispatcher'

import api from '../utils/api'

export default {
  fetchData () {
    console.log('Fetching data')

    api((error, data) => {
      if (error) throw new Error(error)

      console.log('Data fetched successfully')

      AppDispatcher.dispatch({
        type: ActionTypes.COIN_DATA,
        data: {
          coins: data
        }
      })
    })
  }
}
