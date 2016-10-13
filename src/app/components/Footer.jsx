import React from 'react'
import os from 'os'
import classNames from 'classnames'

const { ipcRenderer, shell } = window.require('electron')

import versionStore from '../stores/VersionStore'

import Actions from '../actions/Actions'
import pkg from '../../package.json'
import duration from '../utils/duration'

const platform = os.platform()

const intervals = [ 60000, 300000, 600000, 900000 ]

export default class Footer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      interval: 60000,
      isUpdateAvailable: versionStore.isUpdateAvailable(),
      version: versionStore.getVersion()
    }

    this.quit = this.quit.bind(this)
    this.setUpdateInterval = this.setUpdateInterval.bind(this)
    this.openGitHubLink = this.openGitHubLink.bind(this)
    this.renderIntervalOptions = this.renderIntervalOptions.bind(this)
    this.renderRightButtonGroup = this.renderRightButtonGroup.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.state.interval !== nextState.interval ||
      this.state.isUpdateAvailable !== nextState.isUpdateAvailable ||
      this.state.version !== nextState.version
    )
  }

  componentDidMount () {
    Actions.checkForUpdate()
    this.setUpdateInterval()()
    versionStore.addChangeListener(this.onChange)
  }

  componentWillUnmount () {
    clearInterval(this.updateIntervalHandler)
    versionStore.removeChangeListener(this.onChange)
  }

  onChange () {
    this.setState({
      isUpdateAvailable: versionStore.isUpdateAvailable(),
      version: versionStore.getVersion()
    })
  }

  quit () {
    ipcRenderer.send('quit')
  }

  openGitHubLink () {
    if (this.state.isUpdateAvailable) shell.openExternal(`${pkg.homepage}/releases`)
    else shell.openExternal(pkg.homepage)
  }

  setUpdateInterval (interval = this.state.interval) {
    return () => {
      this.setState({
        interval: interval
      })

      if (this.updateIntervalHandler) clearInterval(this.updateIntervalHandler)
      this.updateIntervalHandler = setInterval(Actions.fetchData, interval)
    }
  }

  renderIntervalOptions () {
    return intervals.map((interval) => {
      const cls = classNames({
        'btn btn-default': true,
        'active': interval === this.state.interval
      })

      return <button className={cls} key={interval} onClick={this.setUpdateInterval(interval)}>{duration(interval)}</button>
    })
  }

  renderRightButtonGroup () {
    const title = this.state.isUpdateAvailable ? 'Update available. Click this button to download new version.' : this.state.version
    const cls = classNames({
      'btn btn-default': true,
      'update-available': this.state.isUpdateAvailable,
      'pull-right': !(platform === 'darwin' || platform === 'win32')
    })

    if (platform === 'darwin' || platform === 'win32') {
      return (
        <div className='btn-group pull-right'>
          <button className={cls} onClick={this.openGitHubLink} title={title}>
            <span className='icon icon-github icon-text' />
            {this.state.version}
          </button>
          <button className='btn btn-default' onClick={this.quit}>
            <span className='icon icon-cancel' />
          </button>
        </div>
      )
    } else {
      return (
        <button className={cls} onClick={this.openGitHubLink}>
          <span className='icon icon-github icon-text' />
          {this.state.version}
        </button>
      )
    }
  }

  render () {
    console.log('Rendering footer')

    return (
      <footer className='toolbar toolbar-footer'>
        <div className='toolbar-actions'>
          <div className='btn-group'>
            <button className='btn btn-default' onClick={Actions.fetchData}>
              <span className='icon icon-arrows-ccw' />
            </button>
            {this.renderIntervalOptions()}
          </div>
          {this.renderRightButtonGroup()}
        </div>
      </footer>
    )
  }
}
