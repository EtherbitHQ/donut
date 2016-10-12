import { ActionTypes } from '../constants/Constants'
import AppDispatcher from '../dispatcher/Dispatcher'

import api from '../utils/api'

export default {
  fetchData () {
    api((error, data) => {
      if (error) throw new Error(error)

      AppDispatcher.dispatch({
        type: ActionTypes.COIN_DATA,
        data: {
          coins: data
        }
      })
    })
  }
}
