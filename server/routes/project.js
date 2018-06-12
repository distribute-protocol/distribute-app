const mongoose = require('mongoose')
const assert = require('assert')

const Project = require('../models/project')

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
      nextDeadline: '', // just for now
      taskIds: [] // should be no tasks just yet
    })
    project.save((err, project) => {
      assert.equal(err, null)
      console.log('project started')
    })
    res.end()
  })

  // independent code below, pllease review!
  // getting one specific project
  app.get('/api/project', (req, res) => {
    console.log('/api/project')
    if (req.query._id) {
      Project.findOne({_id: req.query._id}).exec((err, projectStatus) => {
        assert.equal(err, null)
        if (projectStatus !== null) {
          console.log(projectStatus)
          res.send(projectStatus)
        } else {
          res.send({})
        }
      })
    } else { // populating entire project list
      Project.find({}).exec((err, allProjects) => {
        assert.equal(err, null)
        if (allProjects !== null) {
          console.log(allProjects)
          res.send(allProjects)
        } else {
          res.send({})
        }
      })
    }
  })
  app.get('/api/projects/all', (req, res) => {
    console.log('/api/projects/all')
    if (req.query.state) {
      Project.find({state: req.query.state}).exec((err, projects) => {
        assert.equal(err, null)
        if (projects !== null) {
          console.log(projects)
          res.send(projects)
        } else {
          res.send({})
        }
      })
    }
  })
}
