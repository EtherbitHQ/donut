import React from 'react'
import ReactDOM from 'react-dom'

const { webFrame } = window.require('electron')

import App from './components/App.jsx'
import Actions from './actions/Actions'

Actions.fetchData()
webFrame.setZoomLevelLimits(1, 1)
ReactDOM.render(<App />, document.getElementById('main'))
