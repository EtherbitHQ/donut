import React from 'react'
import SearchInput from 'react-search-input'
import ScaleLoader from 'halogen/ScaleLoader'

import CoinStore from '../stores/CoinStore'
import Actions from '../actions/Actions'

import Coin from './Coin.jsx'
import Footer from './Footer.jsx'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      query: ''
    }

    this.onCoinStoreUpdate = this.onCoinStoreUpdate.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!this.state.coinIDs) return true
    else return this.state.coinIDs.length !== nextState.coinIDs.length
  }

  componentDidMount () {
    Actions.initSocketConnection()
    CoinStore.addChangeListener(this.onCoinStoreUpdate)
  }

  componentWillUnmount () {
    CoinStore.removeChangeListener(this.onCoinStoreUpdate)
  }

  onCoinStoreUpdate () {
    this.setState({
      coinIDs: CoinStore.getCoinIDs(this.state.query)
    })
  }

  renderCoins () {
    if (this.state.coinIDs) {
      return this.state.coinIDs.map((coinID) => <Coin id={coinID} key={coinID} />)
    } else {
      return (
        <li className='list-group-item'>
          <div className='media-body text-center'>
            <ScaleLoader color='#d1cfd1' size='32px' />
          </div>
        </li>
      )
    }
  }

  onSearch (query) {
    this.setState({
      query: query,
      coinIDs: CoinStore.getCoinIDs(query)
    })
  }

  render () {
    console.log('Rendering app')

    return (
      <div className='window'>
        <header className='toolbar toolbar-header'>
          <span className='icon icon-search' />
          <SearchInput type='text' className='search-bar' placeholder='Search for a coin or token e.g. btc or digixdao' onChange={this.onSearch} />
        </header>
        <div className='window-content'>
          <ul className='list-group'>
            {this.renderCoins()}
          </ul>
        </div>
        <Footer />
      </div>
    )
  }
}
