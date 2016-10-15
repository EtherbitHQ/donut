import React from 'react'
import numeral from 'numeral'
import classNames from 'classnames'

import coinStore from '../stores/CoinStore'
import * as CoinUtil from '../utils/coin'

export default class Coin extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      coin: coinStore.getCoinByID(props.id)
    }

    this.onChange = this.onChange.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.state.coin.price_usd !== nextState.coin.price_usd ||
      this.state.coin.price_btc !== nextState.coin.price_btc ||
      this.state.coin.percent_change_1h !== nextState.coin.percent_change_1h
    )
  }

  componentDidMount () {
    coinStore.addChangeListener(this.onChange)
  }

  componentWillUnmount () {
    coinStore.removeChangeListener(this.onChange)
  }

  onChange () {
    this.setState({
      coin: coinStore.getCoinByID(this.props.id)
    })
  }

  render () {
    console.log(`Rendering coin ${this.props.id}`)

    const exists = CoinUtil.coinIcons.indexOf(this.state.coin.symbol.toLowerCase()) !== -1

    const cls = classNames({
      [ `cc ${this.state.coin.symbol}` ]: exists,
      'icon icon-db-shape': !exists,
      'img-circle media-object pull-left': true
    })

    let { name, symbol, price_usd, price_btc, percent_change_1h } = this.state.coin

    return (
      <li className='list-group-item'>
        <i className={cls} />
        <div className='media-body'>
          <strong>{name}
            <span className='pull-right'>{CoinUtil.displayPriceChange(price_btc, price_usd, percent_change_1h)}</span>
          </strong>
          <p>{CoinUtil.displaySymbolPercentageChange(symbol, percent_change_1h)}
            <span className='pull-right text-disabled'>volume ${numeral(this.state.coin['24h_volume_usd']).format('0.0a').toUpperCase()}</span>
          </p>
        </div>
      </li>
    )
  }
}

Coin.propTypes = {
  id: React.PropTypes.string.isRequired
}
