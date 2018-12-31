const ipfsClient = require('ipfs-http-client')
let ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')

module.exports = ipfs
