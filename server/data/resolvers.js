const mongoose = require('mongoose')
const assert = require('assert')
const Avatar = require('../models/avatar')
const Credential = require('../models/credential')
const Network = require('../models/network')
const Project = require('../models/project')
const Reputation = require('../models/reputation')
const Stake = require('../models/stake')
const Task = require('../models/task')
const Token = require('../models/token')
const User = require('../models/user')
const Validation = require('../models/validation')
const Vote = require('../models/vote')
const PrelimTaskList = require('../models/prelimTaskList')
const _ = require('lodash')
// The resolvers
const resolvers = {
  Avatar: {
    credential: (avatar) => Credential.findOne({avatarId: avatar.id}).then(credential => credential)
  },
  Credential: {
    avatar: (credential) => Avatar.findOne({credentialId: credential.id}).then(avatar => avatar),
    user: (credential) => User.findOne({credentialId: credential.id}).then(user => user)
  },
  Project: {
    proposer: (project) => User.findOne({account: project.proposer}).then(user => user),
    stakes: (project) => Stake.find({projectId: project.id}).then(stakes => stakes),
    tasks: (project) => Task.find({projectId: project.id}).then(tasks => tasks),
    location: (project) => Project.findById(project.id, 'location').then(project => project.location)
  },
  Reputation: {
    user: (reputation) => User.findById(reputation.userId).then(user => user)
  },
  Stake: {
    project: (stake) => Project.findById(stake.projectId).then(project => project),
    user: (stake) => User.findById(stake.userId).then(user => user)
  },
  Task: {
    claimer: (task) => User.findById(task.claimer).then(user => user),
    project: (task) => Project.findById(task.projectId).then(project => project),
    validations: (task) => Validation.find({taskId: task.id}).then(validations => validations),
    votes: (task) => Vote.find({taskId: task.id}).then(votes => votes)
  },
  Token: {
    user: (token) => User.findById(token.userId).then(user => user)
  },
  User: {
    credentials: (user) => Credential.findOne({userId: user.id}).then(cred => cred),
    projects: (user) => Project.find({proposer: user.account}).then(projects => projects),
    reputationChanges: (user) => Reputation.find({userId: user.id}).then(reputations => reputations),
    stakes: (user) => Stake.find({userId: user.id}).then(stakes => stakes),
    tasks: (user) => Task.find({claimer: user.id}).then(tasks => tasks),
    tokenChanges: (user) => Token.find({userId: user.id}).then(tokens => tokens),
    validations: (user) => Validation.find({userId: user.id}).then(validations => validations),
    votes: (user) => Vote.find({userId: user.id}).then(votes => votes)
  },
  Validation: {
    task: (validation) => Task.findById(validation.taskId).then(task => task),
    user: (validation) => User.findById(validation.userId).then(user => user)
  },
  Vote: {
    task: (vote) => Task.findById(vote.taskId).then(vote => vote),
    user: (vote) => User.findById(vote.taskId).then(user => user)
  },
  Query: {
    network: () => Network.findOne({}).then(status => status),
    user: (_, args, context, info) => User.findOne({account: args.account}).then(user => user),
    allUsers: () => User.find({}).then(users => users),
    token: (_, args) => [{}],
    allTokens: () => [{}],
    reputation: (_, args) => [{}],
    allReputations: () => [{}],
    project: (_, args) => Project.findOne({address: args.address}).then(project => project),
    allProjects: () => Project.find({}).then(projects => projects),
    allProjectsinState: (_, args) => Project.find({state: args.state}).then(projects => projects),
    allStakes: () => Stake.find({}).then(stakes => stakes),
    userStakes: (_, args) => Stake.find({userId: args.account}).then(stakes => stakes),
    projectStakes: (_, args) => Stake.find({projectId: args.address}).then(stakes => stakes),
    task: (_, args) => Task.find({address: args.address}).then(task => task),
    allTasks: () => Task.find({}).then(tasks => tasks),
    userTasks: (_, args) => User.findOne({account: args.account}).then(user => Task.find({claimer: user.id})).then(tasks => tasks),
    projectTasks: (_, args) => Project.findOne({address: args.address}).then(project => Task.find({projectId: project.id})).then(tasks => tasks),
    verifiedPrelimTaskLists: (_, args) => PrelimTaskList.find({projectId: args.address}).then(prelimTaskList => PrelimTaskList.find({verified: true})).then(prelimTaskLists => prelimTaskLists),
    taskValidations: (address) => [{}],
    userVotes: (account) => [{}],
    taskVotes: (address) => [{}]
  },
  Mutation: {
    addUser: (obj, args) => {
      let credentialObj = Object.assign({_id: new mongoose.Types.ObjectId()}, args.input)
      credentialObj = _.omit(credentialObj, ['avatar'])
      let userObj = new User({
        _id: new mongoose.Types.ObjectId(),
        account: args.account,
        name: args.input.name,
        tokenBalance: 0,
        reputationBalance: 0
      })
      userObj.save((err, user) => {
        assert.equal(err, null)
        let credential = new Credential(Object.assign({userId: user.id}, credentialObj))
        credential.save((err, credential) => {
          assert.equal(err, null)
          let avatar = new Avatar(Object.assign({_id: new mongoose.Types.ObjectId(), credentialId: credential.id}, args.input.avatar))
          avatar.save((err, avatar) => {
            assert.equal(err, null)
          })
        })
        return user
      })
    },
    addTaskList: (obj, args) => {
      Project.findOne({address: args.address}).exec((error, projectStatus) => {
        if (error) console.error(error)
        if (typeof projectStatus !== 'undefined') {
          projectStatus.taskList = args.input // parse and unparse on frontend
          projectStatus.save((error, doc) => {
            if (error) console.error(error)
            return projectStatus
          })
        }
      })
    }
    // taskListInput: (_, args) => Project.findOne({address: args.address}).then(project => Object.assign({taskList: args.taskDetails}))
    // need to save it
    //   addTask: (obj, args) => {
    //     // individual tasks added by the logs
    //     // let taskInputObj = Object.assign({_id: new mongoose.Types.ObjectId()}, args.input)
    //     // project.findOne -- use address to find proj id
    //     Project.findOne({address: projectAddress}).exec((error, projectStatus) => {
    //       if (error) console.error(error)
    //     //   let taskObj = new Task(Object.assign({}, {
    //     //   _id: new mongoose.Types.ObjectId(),
    //     //   description: args.input.description,
    //     //   project:
    //     //   })
    //     })
    //     // taskObj.save((err, task) => {
    //     //   assert.equal(err, null)
    //     //   let taskInput = new TaskInput(Object.assign({taskId: task.id}, taskInputObj))
    //     //   taskInput.save((err, taskInput) => {
    //     //       assert.equal(err,null)
    //     //   })
    //     // })
    //     return task
    //   }
    // addProject: (obj, args) => {
    //   let userObj = new User({
    //     _id: new mongoose.Types.ObjectId(),
    //     account: args.account,
    //     name: args.input.name,
    //     tokenBalance: 0,
    //     reputationBalance: 0
    // })
    // }
  }
}

module.exports = resolvers
