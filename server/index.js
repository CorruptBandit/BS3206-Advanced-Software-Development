const express = require('express')
const MongoDBConnector = require('./mongo')

const app = express()

const PORT = 3001
const mongoDB = new MongoDBConnector()

app.get('/api/users', async (req, res) => {
  try {
    result = await mongoDB.queryCollection('users', {})
    return res.status(200).json(result)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
