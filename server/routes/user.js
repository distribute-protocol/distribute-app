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
    //   const fetchUser = (db, callback) => {
    //   db.collection('user').findOne({'account': req.query.account}, (err, doc) => {
    //     assert.equal(null, err)
    //     if (doc !== null) {
    //       res.send(doc)
    //       console.log('login', req.body, 'server')
    //     } else {
    //       res.send({})
    //       callback()
    //     }
    //   })
    // }
    // MongoClient.connect(url, (err, client) => {
    //   assert.equal(null, err)
    //   var db = client.db('distribute')
    //   fetchUser(db, () => {
    //     client.close()
    //   })
    // })
  })

  // register user
  // make sure to add all uPort body elements --> inside credentials
  app.post('/api/register', (req, res) => {
    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      tokenBalance: 0,
      reputationBalance: 0,
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
  })
}
