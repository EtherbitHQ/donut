import request from 'request'

export default {
  frontAPI (cb) {
    request('https://coincap.io/front', (error, response, body) => {
      if (!error && response.statusCode === 200) {
        cb(null, JSON.parse(body))
      } else {
        cb(error)
      }
    })
  },
  currencyAPI (cb) {
    request('https://coincap.io/exchange_rates', (error, response, body) => {
      if (!error && response.statusCode === 200) {
        cb(null, JSON.parse(body))
      } else {
        cb(error)
      }
    })
  }
}
