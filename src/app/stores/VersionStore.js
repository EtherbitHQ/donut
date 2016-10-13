import BaseStore from './BaseStore'
import AppDispatcher from '../dispatcher/Dispatcher'
import { ActionTypes } from '../constants/Constants'

import pkg from '../../package.json'

class VersionStoreClass extends BaseStore {
  constructor () {
    super()
    this.updateAvailable = false
    this.version = `v${pkg.version}`
  }

  isUpdateAvailable () {
    return this.updateAvailable
  }

  setNewVersion (newVersion) {
    this.updateAvailable = true
    this.version = newVersion
  }

  getVersion () {
    return this.version
  }
}

const versionStore = new VersionStoreClass()

const register = {
  [ ActionTypes.UPDATE_AVAILABLE ]: (data) => {
    versionStore.setNewVersion(data.newVersion)
    versionStore.emitChange()
  }
}

AppDispatcher.register((payload) => {
  const type = payload.type
  const data = payload.data

  ;(register[type] || function () {})(data)
})

export default versionStore
