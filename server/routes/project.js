const mongoose = require('mongoose')
const assert = require('assert')

const User = require('../models/project')

module.exports = function (app, url) {
  // send project to db (or store?)
  app.post('/api/project', (req, res) => {
    console.log('/api/project', req.query)
    let project = new Project({
      _id: new mongoose.Types.ObjectId(),
      state: 0,
      weiBal: 0,
      weiCost: 0,
      reputationBal: 0,
      reputationCost: 0,
      proposer: '',
      proposerType: '',
      nextDeadline: Date.now,// how to instantiate date?? this is based on some googling.
      stakers: [],
      taskIds: [mongoose.Types.ObjectId()]
    })
    project.save((err, project) => {
      assert.equal(err, null)
      console.log('project started')
    })
    res.end()   // should this be res.send()?
  })
}
