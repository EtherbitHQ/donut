import React from 'react'
import os from 'os'
import classNames from 'classnames'

const { ipcRenderer, shell } = window.require('electron')

import Actions from '../actions/Actions'
import pkg from '../../package.json'
import duration from '../utils/duration'

const platform = os.platform()

const intervals = [ 60000, 300000, 600000, 900000 ]

export default class Footer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      interval: 60000
    }

    this.quit = this.quit.bind(this)
    this.updateInterval = this.updateInterval.bind(this)
    this.openGitHubLink = this.openGitHubLink.bind(this)
    this.renderIntervalOptions = this.renderIntervalOptions.bind(this)
    this.renderRightButtonGroup = this.renderRightButtonGroup.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.state.interval !== nextState.interval
  }

  componentDidMount () {
    this.updateInterval()
  }

  quit () {
    ipcRenderer.send('quit')
  }

  openGitHubLink () {
    shell.openExternal(pkg.homepage)
  }

  updateInterval (interval = this.state.interval) {
    return () => {
      this.setState({
        interval: interval
      })

      if (this.updateIntervalHandler) clearInterval(this.updateIntervalHandler)
      this.updateIntervalHandler = setInterval(() => Actions.fetchData, interval)
    }
  }

  renderIntervalOptions () {
    return intervals.map((interval) => {
      const cls = classNames({
        'btn btn-default': true,
        'active': interval === this.state.interval
      })

      return <button className={cls} key={interval} onClick={this.updateInterval(interval)}>{duration(interval)}</button>
    })
  }

  renderRightButtonGroup () {
    if (platform === 'darwin' || platform === 'win32') {
      return (
        <div className='btn-group pull-right'>
          <button className='btn btn-default' onClick={this.openGitHubLink}>
            <span className='icon icon-github icon-text' />
            v{pkg.version}
          </button>
          <button className='btn btn-default' onClick={this.quit}>
            <span className='icon icon-cancel' />
          </button>
        </div>
      )
    } else {
      return (
        <button className='btn btn-default pull-right' onClick={this.openGitHubLink}>
          <span className='icon icon-github icon-text' />
          v{pkg.version}
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
