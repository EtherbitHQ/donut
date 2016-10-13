import request from 'request'
import url from 'url'

import pkg from '../../package.json'

const repoPath = url.parse(pkg.repository).path

export default (cb) => {
  request({
    url: `https://api.github.com/repos${repoPath}/releases/latest`,
    headers: {
      'User-Agent': 'harshjv/donut'
    }
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body)
      const updateAvailable = data.tag_name.substring(1) !== pkg.version
      cb(null, updateAvailable ? data.tag_name : false)
    } else {
      cb(error)
    }
  })
}
