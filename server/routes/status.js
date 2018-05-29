// const mongoose = require('mongoose')
const assert = require('assert')

const User = require('../models/user')
const Network = require('../models/network')

module.exports = function (app, url) {
  // get network status
  app.get('/api/networkstatus', (req, res) => {
    console.log('api/networkstatus')
    Network.findOne({}).exec((err, networkStatus) => {
      assert.equal(err, null)
      if (networkStatus !== null) {
        console.log(networkStatus)
        res.send(networkStatus)
      } else {
        res.send({})
      }
    })
  })

  app.get('/api/userstatus', (req, res) => {
    console.log('api/userstatus')
    console.log(req.query.account)
    User.findOne({account: req.query.account}).exec((err, userStatus) => {
      assert.equal(err, null)
      if (userStatus !== null) {
        console.log(userStatus)
        res.send(userStatus)
      } else {
        res.send({})
      }
    })
  })
}
