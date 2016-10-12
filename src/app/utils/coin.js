import React from 'react'

export const displaySymbolPercentageChange = (symbol, change) => change > 0 ? <span className='positive'>{symbol} +{change}%</span> : <span className='negative'>{symbol} {change}%</span>

export const displayPriceChange = (btc, usd, change) => change > 0 ? <span className='positive'>{btc} BTC ≈ ${usd}</span> : <span className='negative'>{btc} BTC ≈ ${usd}</span>

export const coinIcons = [ 'sar', 'scot', 'sdc', 'sia', 'sjcx', 'slg', 'sls', 'snrg', 'start', 'steem', 'str', 'strat', 'swift', 'sync', 'sys', 'tx', 'unity', 'usdt', 'vior', 'vnl', 'vpn', 'vrc', 'vtc', 'xai', 'xbs', 'xcp', 'xem', 'xmr', 'xpm', 'xrp', 'xvg', 'ybc', 'zeit', 'maid', 'mint', 'mona', 'mrc', 'msc', 'mtr', 'mue', 'nbt', 'neos', 'neu', 'nlg', 'nmc', 'note', 'nvc', 'nxt', 'ok', 'omni', 'opal', 'piggy', 'pink', 'pot', 'ppc', 'qrk', 'rbies', 'rbt', 'rby', 'rdd', 'rise', 'gdc', 'gemz', 'gld', 'grc', 'grs', 'ifc', 'ioc', 'jbs', 'kobo', 'kore', 'lbc', 'ldoge', 'lisk', 'ltc', 'adc', 'aeon', 'amp', 'anc', 'arch', 'banx', 'bay', 'bc', 'bcn', 'bsd', 'bta', 'btc', 'btcd', 'bts', 'clam', 'cloak', 'dao', 'dash', 'dcr', 'dgb', 'dgd', 'dgx', 'dmd', 'doge', 'emc', 'erc', 'etc', 'eth', 'fc2', 'fct', 'frk', 'ftc' ]
