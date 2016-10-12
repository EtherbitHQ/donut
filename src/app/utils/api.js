import request from 'request'

export default (cb) => {
  request('https://api.coinmarketcap.com/v1/ticker/', (error, response, body) => {
    if (!error && response.statusCode === 200) {
      cb(null, JSON.parse(body))
    } else {
      cb(error)
    }
  })
}
