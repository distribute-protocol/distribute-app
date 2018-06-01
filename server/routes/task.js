const mongoose = require('mongoose')
const assert = require('assert')

const User = require('../models/task')

module.exports = function (app, url) {
  // send task
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
      validators: [],
      voters: []
    })
    task.save((err, task) => {
      assert.equal(err, null)
      console.log('task instantiated')
    })
    res.end() // should this be res.send()
  })

  // // get details on one task, based on task id
  // app.get('/api/task', (req, res) => {
  //   console.log('/api/task')
  //   if (req.query.) {   //what goes here? should we use req.params instead of req.query?
  //     Task.findOne({account: })
  //   }
  // })
  // // get all tasks in a project

}
