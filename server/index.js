const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'))
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const DT = require('../frontend/src/abi/DistributeToken')
const fetch = require('node-fetch')

eth.accounts().then(accountsArr => {
  console.log('accountsArr:', accountsArr)
})

const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../frontend/build')))

const serverUrl = 'http://localhost:3001'
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/distribute'

MongoClient.connect(url, (err, client) => {
  assert.equal(null, err)
  console.log('Connected correctly to server.')
  client.close()
})

// function postToDatabase (val) {
//   const setValue = (db, callback) => {
//     db.collection('user').insert({value: val}, (err, doc) => {
//       assert.equal(null, err)
//       console.log('post', val)
//     })
//   }
//   MongoClient.connect(url, (err, client) => {
//     if (err) {
//       console.log('err')
//     }
//     var db = client.db('distribute')
//     // console.log('db', Object.keys(db))
//     // console.log('err', err)
//     assert.equal(null, err)
//     setValue(db, () => {
//       client.close()
//     })
//   })
// }


// filter for minting events
const filter = web3.eth.filter({
  fromBlock: 0,
  toBlock: 'latest',
  address: DT.DistributeTokenAddress,
  topics: [web3.sha3('LogMint(uint256,uint256)')]
})

filter.watch(async (error, result) => {
  if (error) console.error(error)
  console.log(result)
  let eventParams = result.data
  let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
  let tokensMinted = parseInt(eventParamArr[0])

  let config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  let address = '2oviuJhgy5PmF5tK4pNzGjakdjamTqnBNkV'
  await fetch(`${serverUrl}/api/mint?address=${address}&value=${tokensMinted}`, config)
})


// query db for most recent user token balance
app.get('/api/userbalance', function (req, res) {
  // console.log('databaseTest!')
  const fetchResponse = (db, callback) => {
    db.collection('user').find().toArray((err, docs) => {
      assert.equal(null, err)
      console.log('get user balance')
      // res.send()
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
    // console.log('db', db.collection)
    fetchResponse(db, () => {
      client.close()
    })
  })
})

app.post('/api/userbalance', (req, res) => {
  // console.log('value', req.query.value)
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
    // console.log('db', Object.keys(db))
    // console.log('err', err)
    assert.equal(null, err)
    setValue(db, () => {
      client.close()
    })
  })
})

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

app.post('/api/register', (req, res) => {
  const registerUser = (db, callback) => {
    let body = Object.assign({}, req.body, {balance: 0})
    console.log(body, 'REGISTER')
    db.collection('user').insertOne(
      // 'address': req.body.address,
      // 'publicKey': req.body.publicKey
      body
      , (err, result) => {
        assert.equal(err, null)
        const objID = new ObjectId(result.insertedId)
        db.collection('user').findOne({}, {'_id': objID}).then((user) => {
          console.log(user)
          res.send(user)
        })
        // doc.each((err, user) => {
        //   assert.equal(null, err)
        //   console.log(user)
        //   res.send(user)
        // })
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

app.get('/api/totaltokens', (req, res) => {
  console.log('api/totaltokens get')
  // const pubKey = req.query.pubkey
  const fetchBalance = (db, callback) => {
    db.collection('user').find().toArray((err, doc) => {
      assert.equal(null, err)
      if (doc !== null) {
        // doc is an array of documents
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

app.post('/api/mint', (req, res) => {
  const mintTokens = (db, callback) => {
    console.log(req.query.address)
    db.collection('user').update(
      { 'address': req.query.address },
      {
        $inc: { 'balance': parseInt(req.query.value) }
      }
      , (err, result) => {
        assert.equal(err, null)

        db.collection('user').findOne({}, { 'address': req.query.address }).then((user) => {
          console.log(user)
          res.send(user)
        })
        // doc.each((err, user) => {
        //   assert.equal(null, err)
        //   console.log(user)
        //   res.send(user)
        // })
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

//
// app.get('/api/databasetest', function (req, res) {
//   // console.log('databaseTest!')
//   const fetchResponse = (db, callback) => {
//     db.collection('test').find().toArray((err, docs) => {
//       assert.equal(null, err)
//       // res.send()
//       if (docs !== null) {
//         res.send(docs)
//         callback()
//       } else {
//         res.send({})
//         callback()
//       }
//     })
//   }
//   MongoClient.connect(url, (err, client) => {
//     assert.equal(null, err)
//     var db = client.db('distribute')
//     // console.log('db', db.collection)
//     fetchResponse(db, () => {
//       client.close()
//     })
//   })
// })

app.get('/api', (req, res) => {
  console.log('hello world')
})

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'))
})

app.set('port', process.env.PORT || 3001)

app.listen(app.get('port'), () => {
  console.log(`app listening on port ${app.get('port')}`)
})
