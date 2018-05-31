const mongoose = require('mongoose')
const assert = require('assert')

const User = require('../models/user')

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

  app.post('/api/users', (req, res) => {
    console.log('/api/users', req.query)
    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      tokenBalance: 0,
      reputationBalance: 0,
      account: req.query.account,
      // figure out how to get uPort credentials here (do we even need these rn?)
      credentials: req.body,
      projects: {proposed: [], staked: [], active: [], validating: [], voting: [], complete: [], failed: [], expired: []},
      // figure out how to define objects in an array for the mint events to be of a certain type
      // maybe write schema for that separately - time, quantity, etc
      mintEvents: []
    })
    user.save((err, user) => {
      assert.equal(err, null)
      console.log('user inserted')
    })
    res.end()
  })
}
