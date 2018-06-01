const mongoose = require('mongoose')
const assert = require('assert')

const User = require('../models/task')

module.exports = function (app, url) {
  app.post('/api/task', (req, res) => {
    console.log('/api/task', req.query)
    let task = new Task({
      _id: new mongoose.Types.ObjectId(),
      weighting: req.query.weighting,
      description: req.query.description,
      claimerId: mongoose.Types.ObjectId(),
      claimTime: req.query.claimTime,
      claimed: FALSE,
      markedComplete: FALSE,
      valRewardClaimable: FALSE,
      workerRewardClaimable: FALSE,
      validators: [{}],
      voters: [{}]
    })
  })
}
