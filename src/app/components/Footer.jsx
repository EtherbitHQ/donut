import os from 'os'

import Debug from 'debug'

import React from 'react'
import classNames from 'classnames'

import VersionStore from '../stores/VersionStore'
import CurrencyStore from '../stores/CurrencyStore'
import AppStore from '../stores/AppStore'

import AppDispatcher from '../dispatcher/Dispatcher'
import ActionTypes from '../constants/ActionTypes'
import Actions from '../actions/Actions'
import pkg from '../../package.json'

const { ipcRenderer, shell } = window.require('electron')
const debug = Debug('donut:jsx:footer')

const platform = os.platform()

export default class Footer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isUpdateAvailable: VersionStore.isUpdateAvailable(),
      version: VersionStore.getVersion(),
      currencies: CurrencyStore.getCurrencies(),
      selectedCurrency: CurrencyStore.getSelectedCurrency(),
      online: AppStore.isOnline()
    }

    this.quit = this.quit.bind(this)
    this.openGitHubLink = this.openGitHubLink.bind(this)
    this.onVersionChange = this.onVersionChange.bind(this)
    this.onCurrencyChange = this.onCurrencyChange.bind(this)
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this)
    this.onAppStatusChange = this.onAppStatusChange.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.state.isUpdateAvailable !== nextState.isUpdateAvailable ||
      this.state.version !== nextState.version ||
      this.state.selectedCurrency !== nextState.selectedCurrency ||
      this.state.online !== nextState.online
    )
  }

  componentDidMount () {
    Actions.checkForUpdate()
    VersionStore.addChangeListener(this.onVersionChange)
    CurrencyStore.addChangeListener(this.onCurrencyChange)
    AppStore.addChangeListener(this.onAppStatusChange)

    setInterval(Actions.fetchCurrencyData, 30000)
    setInterval(Actions.checkForUpdate, 2160000)
  }

  componentWillUnmount () {
    VersionStore.removeChangeListener(this.onVersionChange)
    CurrencyStore.removeChangeListener(this.onCurrencyChange)
    AppStore.removeChangeListener(this.onAppStatusChange)
  }

  onVersionChange () {
    this.setState({
      isUpdateAvailable: VersionStore.isUpdateAvailable(),
      version: VersionStore.getVersion()
    })
  }

  onCurrencyChange () {
    this.setState({
      currencies: CurrencyStore.getCurrencies(),
      selectedCurrency: CurrencyStore.getSelectedCurrency()
    })
  }

  onAppStatusChange () {
    this.setState({
      online: AppStore.isOnline()
    })
  }

  quit () {
    ipcRenderer.send('quit')
  }

  openGitHubLink () {
    if (this.state.isUpdateAvailable) shell.openExternal(`${pkg.repository}/releases/latest`)
    else shell.openExternal(pkg.repository)
  }

  handleCurrencyChange (event) {
    const currency = event.target.value

    AppDispatcher.dispatch({
      type: ActionTypes.SELECT_CURRENCY,
      data: {
        selectedCurrency: currency
      }
    })
  }

  render () {
    debug('Rendering footer')

    const { currencies, isUpdateAvailable, online, version, selectedCurrency } = this.state

    const currencyList = currencies.map((currency) => {
      return <option key={currency} value={currency}>{currency}</option>
    })

    const updateTitle = isUpdateAvailable ? 'Update available. Click this button to download new version.' : version
    const onlineOfflineTitle = online ? 'Online' : 'Offline'
    const renderCloseButton = platform === 'darwin' || platform === 'win32'

    const updateClass = classNames({
      'btn btn-default': true,
      'update-available': this.state.isUpdateAvailable
    })

    const onlineOfflineClass = classNames({
      'icon icon-record': true,
      'online': online,
      'offline': !online
    })

    return (
      <footer className='toolbar toolbar-footer'>
        <div className='toolbar-actions'>
          <div className='btn-group btn-group-actions'>
            <button className='btn btn-default' title={onlineOfflineTitle}>
              <span className={onlineOfflineClass} />
            </button>
            <button className={updateClass} onClick={this.openGitHubLink} title={updateTitle}>
              <span className='icon icon-github' />
            </button>
            {renderCloseButton ? <button className='btn btn-default' onClick={this.quit}>
              <span className='icon icon-cancel' />
            </button> : ''}
          </div>
          {currencyList.length > 0 ? <select className='form-control currency-list pull-right' value={selectedCurrency} onChange={this.handleCurrencyChange}>
            {currencyList}
          </select> : ''}
        </div>
      </footer>
    )
  }
}
