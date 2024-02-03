const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()
const env = process.env

class MongoDBConnector {
  constructor () {
    this.uri = `mongodb+srv://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@bs3206.7ikwc7d.mongodb.net/?retryWrites=true&w=majority`
    this.dbName = 'AdvancedSoftwareDev'
    this.client = new MongoClient(this.uri)

    this.connect()
  }

  async connect () {
    try {
      await this.client.connect()
      console.log('Connected to MongoDB')
      this.db = this.client.db(this.dbName)
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
    }
  }

  async disconnect () {
    try {
      await this.client.close()
      console.log('Disconnected from MongoDB')
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error)
    }
  }

  async insertDocument(collectionName, document) {
    if (!this.db) {
      console.error('MongoDB not connected.');
      return;
    }

    try {
      const result = await this.db.collection(collectionName).insertOne(document);
      return result;
    } catch (error) {
      console.error('Error inserting document:', error);
      throw error;
    }
  }

  queryCollection (collectionName, query) {
    const asyncFunction = async (collectionName, query) => {
      try {
        const collection = this.db.collection(collectionName)
        const result = collection.find(query).toArray()
        return await result
      } catch (error) {
        console.error('Error querying MongoDB:', error)
        throw error
      }
    }

    return asyncFunction(collectionName, query)
  }
}

module.exports = MongoDBConnector
