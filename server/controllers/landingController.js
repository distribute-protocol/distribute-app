const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

module.exports = function (app, url) {
  app.get('/api/login', (req, res) => {
    console.log('api/login get')
    const address = req.query.address
    // const pubKey = req.query.pubkey
    const fetchUser = (db, callback) => {
      db.collection('user').findOne({'address': address}, (err, doc) => {
        assert.equal(null, err)
        if (doc !== null) {
          res.send(doc)
          console.log('login', address, 'server')
        } else {
          res.send({})
          callback()
        }
      })
    }
    MongoClient.connect(url, (err, client) => {
      assert.equal(null, err)
      var db = client.db('distribute')
      fetchUser(db, () => {
        client.close()
      })
    })
  })
}
