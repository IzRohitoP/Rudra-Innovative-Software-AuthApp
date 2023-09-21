const mongoose = require("mongoose");
require("dotenv").config();
exports.connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected..");
  } catch (error) {
    console.log(error);
  }
};
