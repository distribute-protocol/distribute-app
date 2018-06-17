const avatar = require('../models/avatar')
const credential = require('../models/credential')
const network = require('../models/network')
const project = require('../models/project')
const reputation = require('../models/reputation')
const stake = require('../models/stake')
const task = require('../models/task')
const token = require('../models/token')
const user = require('../models/user')
const validation = require('../models/validation')
const vote = require('../models/vote')
// The resolvers
const resolvers = {
  Avatar: {
    credential: (avatar) => credential.findOne({avatarId: avatar.id}).then(credential => credential)
  },
  Credential: {
    avatar: (credential) => avatar.findOne({credentialId: credential.id}).then(avatar => avatar),
    user: (credential) => user.findOne({credentialId: credential.id}).then(user => user)
  },
  Project: {
    proposer: (project) => user.findOne({account: project.proposer}).then(user => user),
    stakes: (project) => stake.find({projectId: project.id}).then(stakes => stakes),
    tasks: (project) => task.find({projectId: project.id}).then(tasks => tasks)
  },
  Reputation: {
    user: (reputation) => user.findById(reputation.userId).then(user => user)
  },
  Stake: {
    project: (stake) => project.findById(stake.projectId).then(project => project),
    user: (stake) => user.findById(stake.userId).then(user => user)
  },
  Task: {
    claimer: (task) => user.findById(task.claimer).then(user => user),
    project: (task) => project.findById(task.projectId).then(project => project),
    validations: (task) => validation.find({taskId: task.id}).then(validations => validations),
    votes: (task) => vote.find({taskId: task.id}).then(votes => votes)
  },
  Token: {
    user: (token) => user.findById(token.userId).then(user => user)
  },
  User: {
    credentials: (user) => credential.findOne({userId: user.id}).then(cred => cred),
    projects: (user) => project.find({proposer: user.account}).then(projects => projects),
    repuationChanges: (user) => reputation.find({userId: user.id}).then(reputations => reputations),
    stakes: (user) => stake.find({userId: user.id}).then(stakes => stakes),
    tasks: (user) => task.find({claimer: user.id}).then(tasks => tasks),
    tokenChanges: (user) => token.find({userId: user.id}).then(tokens => tokens),
    validations: (user) => validation.find({userId: user.id}).then(validations => validations),
    votes: (user) => vote.find({userId: user.id}).then(votes => votes)
  },
  Validation: {
    task: (validation) => task.findById(validation.taskId).then(task => task),
    user: (validation) => user.findById(validation.userId).then(user => user)
  },
  Vote: {
    task: (vote) => task.findById(vote.taskId).then(vote => vote),
    user: (vote) => user.findById(vote.taskId).then(user => user)
  },
  Query: {
    network: () => network.findOne({}).then(status => status),
    user: (account) => user.findOne({account}).then(user => user),
    allUsers: () => user.find({}).then(users => users),
    token: (account) => [{}],
    allTokens: () => [{}],
    reputation: (account) => [{}],
    allReputations: () => [{}],
    project: (address) => project.findOne({address}).then(project => project),
    allProjects: () => project.find({}).then(projects => projects),
    userStakes: (account) => [{}],
    projectStakes: (address) => [{}],
    task: (address) => {},
    allTasks: () => [{}],
    userTasks: (account) => [{}],
    projectTasks: (address) => [{}],
    userValidations: (account) => [{}],
    taskValidations: (address) => [{}],
    userVotes: (account) => [{}],
    taskVotes: (address) => [{}]
  }
}

module.exports = resolvers
