const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOCS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected :=> ${conn.connection.host}`);
  } catch (error) {
    console.log(`${error.message}`);
  }
};

module.exports = connectDb;
