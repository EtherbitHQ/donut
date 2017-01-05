import React from 'react'
import classNames from 'classnames'

const { ipcRenderer } = window.require('electron')

import CoinStore from '../stores/CoinStore'
import CurrencyStore from '../stores/CurrencyStore'

import * as CoinUtil from '../utils/coin'
import * as FormatUtil from '../utils/format'

function updateTitle (shortPrice, price, currency) {
  ipcRenderer.send('update-btc-price', { shortPrice, price, currency })
}

export default class Coin extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      coin: CoinStore.getCoinByID(props.id),
      selectedCurrency: CurrencyStore.getSelectedCurrency(),
      selectedCurrencyValue: CurrencyStore.getSelectedCurrencyValue(),
      shouldFlash: false
    }

    this.onCoinStateChange = this.onCoinStateChange.bind(this)
    this.onCurrencyChange = this.onCurrencyChange.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.state.coin.price !== nextState.coin.price ||
      this.state.coin.volume !== nextState.coin.volume ||
      this.state.coin.perc !== nextState.coin.perc ||
      this.state.selectedCurrency !== nextState.selectedCurrency ||
      this.state.selectedCurrencyValue !== nextState.selectedCurrencyValue
    )
  }

  onCurrencyChange () {
    this.setState({
      selectedCurrency: CurrencyStore.getSelectedCurrency(),
      selectedCurrencyValue: CurrencyStore.getSelectedCurrencyValue(),
      shouldFlash: false
    })
  }

  componentDidMount () {
    CoinStore.addChangeListener(this.onCoinStateChange)
    CurrencyStore.addChangeListener(this.onCurrencyChange)
  }

  componentWillUnmount () {
    CoinStore.removeChangeListener(this.onCoinStateChange)
    CurrencyStore.removeChangeListener(this.onCurrencyChange)
  }

  onCoinStateChange () {
    this.setState({
      coin: CoinStore.getCoinByID(this.props.id),
      shouldFlash: true
    })
  }

  render () {
    console.log(`Rendering coin ${this.props.id}`)

    const { shouldFlash, selectedCurrency, selectedCurrencyValue } = this.state
    const { long, short, price, perc, volume, cap24hrChange } = this.state.coin
    const safePrice = isNaN(price) ? 0 : price

    const iconClass = CoinUtil.getCoinClass(short)
    const positiveChangeInPrice = FormatUtil.isPositive(perc)
    const positiveChangeInVolume = FormatUtil.isPositive(cap24hrChange)
    const oldBackgroundClass = this.coinRef && this.coinRef.className.split(' ')[1]

    const listClass = classNames({
      'list-group-item': true,
      'positive': positiveChangeInPrice,
      'negative': !positiveChangeInPrice,
      'positive-bg': shouldFlash && positiveChangeInPrice && oldBackgroundClass !== 'positive-bg',
      'positive-bg-alt': shouldFlash && positiveChangeInPrice && oldBackgroundClass === 'positive-bg',
      'negative-bg': shouldFlash && !positiveChangeInPrice && oldBackgroundClass !== 'negative-bg',
      'negative-bg-alt': shouldFlash && !positiveChangeInPrice && oldBackgroundClass === 'negative-bg'
    })

    const volumeChangeClass = classNames({
      'pull-right': true,
      'positive': positiveChangeInVolume,
      'negative': !positiveChangeInVolume
    })

    const priceInBTC = CoinStore.getPriceInBTC(safePrice)
    const priceInSelectedCurrency = safePrice * selectedCurrencyValue

    const formattedBTCPrice = FormatUtil.getFormattedBTCPrice(priceInBTC)
    const formattedCurrencyPrice = FormatUtil.getFormattedCurrencyPrice(priceInSelectedCurrency)
    const formattedCurrencyPriceShort = FormatUtil.getFormattedCurrencyPriceShort(priceInSelectedCurrency)
    const formattedVolumeChange = FormatUtil.getFormattedPercentage(cap24hrChange)
    const formattedChangeInPercentage = FormatUtil.getFormattedPercentage(perc)
    const formattedVolume = FormatUtil.getFormattedVolume(volume)

    if (short === 'BTC') updateTitle(formattedCurrencyPriceShort, formattedCurrencyPrice, selectedCurrency)

    return (
      <li className={listClass} ref={(ref) => { this.coinRef = ref }}>
        <i className={iconClass} />
        <div className='media-body'>
          <strong>
            {long}
            <span className='pull-right'>
              {formattedBTCPrice} BTC ≈ {formattedCurrencyPrice} {selectedCurrency}
            </span>
          </strong>
          <p>
            {short} {formattedChangeInPercentage}
            <span className={volumeChangeClass}>volume ${formattedVolume} ({formattedVolumeChange})</span>
          </p>
        </div>
      </li>
    )
  }
}

Coin.propTypes = {
  id: React.PropTypes.string.isRequired
}
