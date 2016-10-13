import { ActionTypes } from '../constants/Constants'
import AppDispatcher from '../dispatcher/Dispatcher'

import api from '../utils/api'
import checkForUpdate from '../utils/checkForUpdate'

export default {
  checkForUpdate () {
    console.log('Checking for update')

    checkForUpdate((error, updateAvailable) => {
      if (error) throw new Error(error)

      console.log('Successfully checked for update')

      if (updateAvailable) {
        console.log('Update available', updateAvailable)

        AppDispatcher.dispatch({
          type: ActionTypes.UPDATE_AVAILABLE,
          data: {
            newVersion: updateAvailable
          }
        })
      }
    })
  },

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
