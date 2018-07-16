const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')

// The GraphQL schema in string form
// change taskList to currentTaskList
const typeDefs = `
  type Avatar {
    credential: Credential
    uri: String
  }

  type Credential {
    address: String
    avatar: Avatar
    context: String
    id: ID
    name: String
    networkAddress: String
    publicEncKey: String
    publicKey: String
    pushToken: String
    type: String
    user: User
  }

  type Network {
    currentPrice: Int
    ethPrice: Int
    totalReputation: Int
    totalTokens: Int
    weiBal: String
  }

  type Project {
    activeStatePeriod: Int
    address: String
    id: ID
    ipfsHash: String
    location: Location
    name: String
    nextDeadline: String
    passThreshold: Int
    photo: String
    proposer: User
    proposerType: Int
    reputationBalance: Int
    reputationCost: Int
    stakedStatePeriod: Int
    stakes: [Stake]
    state: Int
    summary: String
    tasks: [Task]
    taskList: String
    topTaskHash: String
    prelimTaskLists: [PrelimTaskList]
    tokenBalance: Int
    turnoverTime: Int
    validateStatePeriod: Int
    voteCommitPeriod: Int
    voteRevealPeriod: Int
    weiBal: String
    weiCost: String
  }

  type PrelimTaskList {
    id: ID
    verified: Boolean
    address: String
    hash: String
    submitter: String
    weighting: Int
    content: String
  }

  type Location{
    lat: Float
    lng: Float
  }

  type Reputation {
    user: User
    amount: Int
  }

  type Stake {
    amount: Int
    id: ID
    project: Project
    type: String
    user: User
  }

  type Task {
    address: String
    claimed: Boolean
    claimedAt: String
    claimer: User
    complete: Boolean
    description: String
    id: ID
    index: Int
    project: Project
    validations: [Validation]
    validationRewardClaimable: Boolean
    votes: [Vote]
    weighting: Int
    workerRewardClaimable: Boolean
  }

  type Token {
    user: User
    amount: Int
    ether: Int
  }

  type User {
    id: ID
    account: String
    credentials: Credential
    name: String
    projects: [Project]
    reputationBalance: Int
    reputationChanges: [Reputation]
    stakes: [Stake]
    tasks: [Task]
    tokenBalance: Int
    tokenChanges: [Token]
    validations: [Validation]
    votes: [Vote]
  }

  type Validation {
    id: ID
    amount: Int
    task: Task
    user: User
    state: Boolean
  }

  type Vote {
    id: ID
    amount: Int
    commit: Boolean
    reveal: Boolean
    pulled: Boolean
    state: Boolean
    task: Task
    type: String
    user: User
  }

  type Query {
    network: Network
    user(account: String): User
    allUsers: [User]
    token(account: String): [Token]
    allTokens: [Token]
    reputation(account: String): [Reputation]
    allReputations: [Reputation]
    project(address: String): Project
    allProjects: [Project]
    allProjectsinState(state: Int): [Project]
    allStakes: [Stake]
    userStakes(account: String): [Stake]
    projectStakes(address: String): [Stake]
    task(address: String): Task
    allTasks: [Task]
    userTasks(account: String): [Task]
    projectTasks(address: String): [Task]
    userValidations(account: String): [Validation]
    taskValidations(address: String): [Validation]
    userVotes(account: String): [Vote]
    taskVotes(address: String): [Vote]
    verifiedPrelimTaskLists(address: String): [PrelimTaskList]
    userPrelimTaskLists(address: String): [PrelimTaskList]
    findFinalTaskHash(address: String, topTaskHash: String): PrelimTaskList
  }

  input AvatarInput {
    uri: String
  }

  input CredentialInput {
    address: String
    avatar: AvatarInput
    id: ID
    name: String
    networkAddress: String
    publicEncKey: String
    publicKey: String
    pushToken: String
  }

  type Mutation {
    addUser(input: CredentialInput, account: String): User
    addTaskList(input: String, address: String): Project
    addPrelimTaskList(address: String, taskHash: String, submitter: String): Project
  }
`
// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

module.exports = schema
