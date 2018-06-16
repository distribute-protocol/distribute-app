const { makeExecutableSchema } = require('graphql-tools')
const network = require('../models/network')
const user = require('../models/user')
const project = require('../models/project')
const task = require('../models/task')
// The GraphQL schema in string form
const typeDefs = `
  type Network {
    totalTokens: Int!
    totalReputation: Int!
    currentPrice: Int!
    ethPrice: Int!
    weiBal: Int!
  }

  type Credential {
    id: ID!
    user: User!
    context: String!
    type: String!
    address: String!
    avatar: Avatar!
    name: String!
    networkAddress: String!
    publicEncKey: String!
    publicKey: String!
    pushToken: String!
  }

  type Avatar {
    credential: Credential!
    uri: String!
  }

  type User {
    id: ID!
    tokenBalance: Int!
    reputationBalance: Int!
    account: String!
    credentials: Credential!
    name: String!
    projects: [Project!]
    tasks: [Task!]
    tokenChanges: [Token!]
    repuationChanges: [Reputation!]
    validations: [Validation!]
    votes: [Votes!]
  }

  type Token {
    user: User!
    amount: Int!
    ether: Int!
  }

  type Reputation {
    user: User!
    amount: Int!
  }

  type Project {
    id: ID!
    address: String!
    weiCost: Int!,
    weiBal: Int!,
    reputationCost: Int!
    reputationBalance: Int!
    state: Int!
    nextDeadline: String!
    proposer: User!
    proposerType: Int!
    ipfsHash: String!
    stakedStatePeriod: Int!
    activeStatePeriod: Int!
    turnoverTime: Int!
    validateStatePeriod: Int!
    voteCommitPeriod: Int!
    voteRevealPeriod: Int!
    passThreshold: Int!
    stakes: [Stake!]
    tasks: [Task!]
  }

  type Stake {
    id: ID!
    project: Project!
    type: String!
    user: User!
  }

  type Task {
    id: ID!
    project: Project!
    user: User!
    weighting: Int!
    description: String!
    claimedAt: String!
    claimed: Boolean!
    complete: Boolean!
    valiationRewardClaimable: Boolean!
    workerRewardClaimable: Boolean!
    validations: [Validation!]
    votes: [Vote!]
  }

  type Validation {
    id: ID!
    task: Task!
    user: User!
    state: Boolean!
  }

  type Vote {
    id: ID!
    task: Task!
    user: User!
    type: String!
  }

  type Query {
    network: Network
    user(account: String): User
    allUsers: [User]
    token(account: String): [Token]
    reputation(account: String): [Reputation]
    project(address: String): Project
    allProjects: [Project]
    userStakes(account: String): [Stake]
    projectStakes(address: String): [Stake]
    task(address: String): Task
    allTasks: [Task]
    userTasks(account: String): [Task]
    projectTasks(address: String): [Task]
    userValidations(account: String): [Validation]
    taskValidations(address: String): [Validation]
    userVotes(account: String): [Vote]
    taskVotes(address: String): [Task]
  }
`
// The resolvers
const resolvers = {
  Query: {
    network: () => network.findOne({}).then(status => status),
    user: (account) => user.findOne({account}).then(user => user),
    allUsers: () => user.find({}).then(users => users),
    token: (account) => [{}],
    reputation: (account) => [{}],
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
  },
  User: {
    projects: (user) => [{}],
    tasks: (user) => [{}],
    tokensChanges: (user) => [{}],
    repuationChanges: (user) => [{}]
  },
  Project: {
    stakes: (project) => [{}],
    tasks: (project) => [{}]
  },
  Task: {
    validations: (task) => [{}],
    votes: (task) => [{}]
  }
}

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// addMockFunctionsToSchema({ schema, mocks })

module.exports = schema
