const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
let database_url = process.env.MONGO_CONNECTION;
if (process.env.NODE_ENV === "testing") {
  database_url = database = process.env.MONGO_CONNECTION_TEST;
}



const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(database_url);
  }
};

const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

const clearDB = async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
      await collection.deleteMany({})
  }
};

module.exports = { connectDB, closeDB, clearDB };