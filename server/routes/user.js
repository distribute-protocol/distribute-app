const mongoose = require('mongoose')
const assert = require('assert')

const User = require('../models/user')
const Network = require('../models/network')

module.exports = function (app, url) {
  app.get('/api/login', (req, res) => {
    User.findOne({account: req.query.account}).exec((err, userStatus) => {
      if (err) throw Error
      if (userStatus !== null) {
        res.send(userStatus)
      } else {
        res.send({})
      }
    })
  })

  // register user
  // make sure to add all uPort body elements --> inside credentials
  app.post('/api/register', (req, res) => {
    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      tokenBalance: 0,
      reputationBalance: 10000,
      address: req.query.account,
      credentials: req.body,
      projects: {proposed: [], staked: [], active: [], validating: [], voting: [], complete: [], failed: [], expired: []},
      // figure out how to define objects in an array for the mint events to be of a certain type
      // maybe write schema for that separately - time, quantity, etc
      mintEvents: []
    })

    user.save((err, user) => {
      assert.equal(err, null)
      console.log('user inserted')
      res.send(user)
    })

    Network.findOne({}).exec((err, netStatus) => {
      if (err) throw Error
      netStatus.totalReputation += 10000
      // netStatus.currentPrice
      netStatus.save((err) => {
        if (err) throw Error
        console.log('netStatus updated')
      })
    })
  })
}
