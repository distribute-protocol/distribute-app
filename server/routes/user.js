const mongoose = require('mongoose')
const assert = require('assert')

const User = require('../models/user')

module.exports = function (app, url) {
  app.post('/api/user', (req, res) => {
    console.log('/api/user', req.query)
    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      tokenBalance: 0,
      reputationBalance: 0,
      account: req.query.account,
      credentials: req.body,
      projects: [mongoose.Types.ObjectId()], // not sure
      mintEvents: [],
      claimedTasks: [mongoose.Types.ObjectId()]
    })
    user.save((err, user) => {
      assert.equal(err, null)
      console.log('user inserted')
    })
    res.end()   // should this be res.send() instead?
  })

  app.get('/api/user', (req, res) => {
    console.log('/api/user')
    if (req.query.account) {
      User.findOne({account: req.query.account}).exec((err, userStatus) => {
        assert.equal(err, null)
        if (userStatus !== null) {
          console.log(userStatus)
          res.send(userStatus)
        } else {
          res.send({})    // should this be res.end()?
        }
      })
    } else {
      User.find({}).exec((err, allUsers) => {
        assert.equal(err, null)
        if (allUsers !== null) {
          console.log(allUsers)
          res.send(allUsers)
        } else {
          res.send({})    // should this be res.end()
        }
      })
    }
  })
}
