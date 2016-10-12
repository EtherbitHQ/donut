import React from 'react'
import SearchInput from 'react-search-input'

import coinStore from '../stores/CoinStore'

import Coin from './Coin.jsx'
import Footer from './Footer.jsx'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      query: ''
    }

    this.onChange = this.onChange.bind(this)
    this.searchUpdated = this.searchUpdated.bind(this)
  }

  componentDidMount () {
    coinStore.addChangeListener(this.onChange)
  }

  componentWillUnmount () {
    coinStore.removeChangeListener(this.onChange)
  }

  onChange () {
    this.setState({
      coin_ids: coinStore.getCoinIDs(this.state.query)
    })
  }

  renderCoins () {
    if (this.state.coin_ids) {
      return this.state.coin_ids.map((coin_id) => <Coin id={coin_id} key={coin_id} />)
    } else {
      return (
        <li className='list-group-item'>
          <div className='media-body text-center'>
            <strong>Loading...</strong>
          </div>
        </li>
      )
    }
  }

  searchUpdated (query) {
    this.setState({
      query: query,
      coin_ids: coinStore.getCoinIDs(query)
    })
  }

  render () {
    console.log('Rendering app')

    return (
      <div className='window'>
        <header className='toolbar toolbar-header'>
          <span className='icon icon-search' />
          <SearchInput type='text' className='search-bar' placeholder='Search for a coin e.g. btc or ethereum' onChange={this.searchUpdated} />
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
