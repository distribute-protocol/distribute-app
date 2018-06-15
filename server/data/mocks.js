const casual = require('casual')

const mocks = {
  String: () => 'It works!',
  Query: () => ({
    user: (root, args) => {
      return { name: 'Ashoka', account: args.account }
    }
  }),
  User: () => ({ account: casual.string }),
  Project: () => ({ address: casual.string }),
  Task: () => ({ address: casual.string })
}

module.exports = mocks
