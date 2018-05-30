const mongoose = require('mongoose')
const assert = require('assert')

const User = require('../models/user')
const Network = require('../models/network')

module.exports = function (app, url) {
  app.get('/api/users', (req, res) => {
    console.log('/api/users')
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
