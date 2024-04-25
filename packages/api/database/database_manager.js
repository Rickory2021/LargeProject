const { MongoClient } = require('mongodb');

const url = process.env.DATABASE_URL;
const client = new MongoClient(url);

let dbInstance = null;

const connectToServer = async () => {
  try {
    await client.connect();
    // console.log('Successfully connected to MongoDB.');
    dbInstance = client.db('inventory_tracker');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

const getDatabase = () => {
  return dbInstance;
};

module.exports = { connectToServer, getDatabase };
