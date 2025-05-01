
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOURL + `/` + process.env.DBNAME, {});
console.log(`MongoDB Database: ${conn.connection.name} Connected Successfully!\nHost: ${conn.connection.host}\n`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
