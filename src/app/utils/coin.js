import classNames from 'classnames'

export const coinIcons = [ 'sar', 'scot', 'sdc', 'sia', 'sjcx', 'slg', 'sls', 'snrg', 'start', 'steem', 'str', 'strat', 'swift', 'sync', 'sys', 'tx', 'unity', 'usdt', 'vior', 'vnl', 'vpn', 'vrc', 'vtc', 'xai', 'xbs', 'xcp', 'xem', 'xmr', 'xpm', 'xrp', 'xvg', 'ybc', 'zeit', 'maid', 'mint', 'mona', 'mrc', 'msc', 'mtr', 'mue', 'nbt', 'neos', 'neu', 'nlg', 'nmc', 'note', 'nvc', 'nxt', 'ok', 'omni', 'opal', 'piggy', 'pink', 'pot', 'ppc', 'qrk', 'rbies', 'rbt', 'rby', 'rdd', 'rise', 'gdc', 'gemz', 'gld', 'grc', 'grs', 'ifc', 'ioc', 'jbs', 'kobo', 'kore', 'lbc', 'ldoge', 'lisk', 'ltc', 'adc', 'aeon', 'amp', 'anc', 'arch', 'banx', 'bay', 'bc', 'bcn', 'bsd', 'bta', 'btc', 'btcd', 'bts', 'clam', 'cloak', 'dao', 'dash', 'dcr', 'dgb', 'dgd', 'dgx', 'dmd', 'doge', 'emc', 'erc', 'etc', 'eth', 'fc2', 'fct', 'frk', 'ftc' ]

export const getCoinClass = (symbol) => {
  const exists = coinIcons.indexOf(symbol.toLowerCase()) !== -1
  return classNames({
    [ `cc ${symbol}` ]: exists,
    'icon icon-db-shape': !exists,
    'img-circle media-object pull-left': true
  })
}
