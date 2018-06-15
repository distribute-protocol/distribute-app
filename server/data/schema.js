const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const network = require('../models/network')
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
    account: String!
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
    tokensChanges: [Token!]
    repuationChanges: [Reputation!]
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
    user: (account) => {},
    allUsers: () => {},
    token: (account) => [{}],
    reputation: (account) => [{}],
    project: (address) => {},
    allProjects: () => [{id: 1, address: 'hello'}, {id: 2, address: 'goodbye'}],
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
