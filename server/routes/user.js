const mongoose = require('mongoose')
const assert = require('assert')
const Avatar = require('../models/avatar')
const Credential = require('../models/credential')
const User = require('../models/user')
const _ = require('lodash')

module.exports = function (app, url) {
  app.post('/api/user', (req, res) => {
    let credentialObj = Object.assign({_id: new mongoose.Types.ObjectId()}, req.body)
    credentialObj = _.omit(credentialObj, ['avatar'])
    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      account: req.query.account,
      name: req.query.name,
      tokenBalance: 0,
      reputationBalance: 0
    })
    user.save((err, user) => {
      assert.equal(err, null)
      let credential = new Credential(Object.assign({userId: user.id}, credentialObj))
      credential.save((err, credential) => {
        assert.equal(err, null)
        let avatar = new Avatar(Object.assign({_id: new mongoose.Types.ObjectId(), credentialId: credential.id}, req.body.avatar))
        avatar.save((err, avatar) => {
          assert.equal(err, null)
        })
      })
    })
    res.end()
  })

// remove this
  app.get('/api/user', (req, res) => {
    if (req.query.account) {
      User.findOne({account: req.query.account}).exec((err, userStatus) => {
        assert.equal(err, null)
        if (userStatus !== null) {
          res.send(userStatus)
        } else {
          res.send({})    // should this be res.end()?
        }
      })
    } else {
      User.find({}).exec((err, allUsers) => {
        assert.equal(err, null)
        if (allUsers !== null) {
          res.send(allUsers)
        } else {
          res.send({})    // should this be res.end()
        }
      })
    }
  })
}
