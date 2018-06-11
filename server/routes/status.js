const assert = require('assert')

const Network = require('../models/network')

module.exports = function (app, url) {
  // get network status
  app.get('/api/network', (req, res) => {
    //console.log('/api/network')
    Network.findOne({}).exec((err, networkStatus) => {
      assert.equal(err, null)
      if (networkStatus !== null) {
        //console.log(networkStatus)
        res.send(networkStatus)
      } else {
        res.send({})
      }
    })
  })
}
