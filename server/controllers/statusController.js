const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

module.exports = function (app, url) {
  // get user balance
  app.get('/api/userbalance', function (req, res) {
    console.log('api/userbalance get')
    const fetchResponse = (db, callback) => {
      db.collection('user').findOne({}, { 'account': req.query.account }).then((docs) => {
        if (docs !== null) {
          res.send(docs)
          callback()
        } else {
          res.send({})
          callback()
        }
      })
    }
    MongoClient.connect(url, (err, client) => {
      assert.equal(null, err)
      var db = client.db('distribute')
      fetchResponse(db, () => {
        client.close()
      })
    })
  })

  // update user balance
  app.post('/api/userbalance', (req, res) => {
    const setValue = (db, callback) => {
      db.collection('user').insertOne({value: req.query.value}, (err, doc) => {
        assert.equal(null, err)
        console.log('post user balance')
        res.send(doc.value)
        callback()
      })
    }
    MongoClient.connect(url, (err, client) => {
      if (err) {
        console.log('err')
      }
      var db = client.db('distribute')
      assert.equal(null, err)
      setValue(db, () => {
        client.close()
      })
    })
  })

  // get user reputation
  app.get('/api/userreputation', function (req, res) {
    console.log('api/userreputation get')
    const fetchResponse = (db, callback) => {
      db.collection('user').findOne({}, { 'account': req.query.account }).then((docs) => {
        if (docs !== null) {
          console.log(docs)
          res.send(docs)
          callback()
        } else {
          res.send({})
          callback()
        }
      })
    }
    MongoClient.connect(url, (err, client) => {
      assert.equal(null, err)
      var db = client.db('distribute')
      fetchResponse(db, () => {
        client.close()
      })
    })
  })

  // register user
  app.post('/api/register', (req, res) => {
    const registerUser = (db, callback) => {
      let body = Object.assign({}, req.body, {balance: 0, reputation: 10000, account: req.query.account})
      console.log(body, 'REGISTER')
      db.collection('user').insertOne(
        body
        , (err, result) => {
          assert.equal(err, null)
          const objID = new ObjectId(result.insertedId)
          db.collection('user').findOne({}, {'_id': objID}).then((user) => {
            // console.log(user)
            res.send(user)
          })
          console.log('Inserted a document into the user collection.')
          callback()
        })
    }
    MongoClient.connect(url, (err, client) => {
      assert.equal(null, err)
      var db = client.db('distribute')
      registerUser(db, () => {
        client.close()
      })
    })
  })

  // get total tokens
  app.get('/api/totaltokens', (req, res) => {
    console.log('api/totaltokens get')
    const fetchBalance = (db, callback) => {
      db.collection('user').find().toArray((err, doc) => {
        assert.equal(null, err)
        if (doc !== null) {
          res.send(doc)
        } else {
          res.send({})
          callback()
        }
      })
    }
    MongoClient.connect(url, (err, client) => {
      assert.equal(null, err)
      var db = client.db('distribute')
      fetchBalance(db)
      client.close()
    })
  })

  // get total reputation
  app.get('/api/totalreputation', (req, res) => {
    console.log('api/totalreputation get')
    const fetchBalance = (db, callback) => {
      db.collection('user').find().toArray((err, doc) => {
        assert.equal(null, err)
        if (doc !== null) {
          console.log(doc)
          res.send(doc)
        } else {
          res.send({})
          callback()
        }
      })
    }
    MongoClient.connect(url, (err, client) => {
      assert.equal(null, err)
      var db = client.db('distribute')
      fetchBalance(db)
      client.close()
    })
  })

  // mint tokens
  app.post('/api/mint', (req, res) => {
    console.log('api/mint post')
    const mintTokens = (db, callback) => {
      db.collection('user').update(
        { 'account': req.query.account },
        {
          $inc: { 'balance': parseInt(req.query.value) }
        }
        , (err, result) => {
          assert.equal(err, null)

          db.collection('user').findOne({}, { 'account': req.query.account }).then((user) => {
            console.log(user)
            res.send(user)
          })
          console.log('Updated a document in the user collection.')
          callback()
        })
    }
    MongoClient.connect(url, (err, client) => {
      assert.equal(null, err)
      var db = client.db('distribute')
      mintTokens(db, () => {
        client.close()
      })
    })
  })
}
