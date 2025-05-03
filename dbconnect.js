
'use strict'
import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await connect(`${process.env.MONGOURL} ${process.env.DBNAME}`, {});
    console.log(`MongoDB Database: ${conn.connection.name} Connected Successfully!\nHost: ${conn.connection.host}\n`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
