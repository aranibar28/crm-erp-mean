const mongoose = require("mongoose");

const db_connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/business");
    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting");
  }
};

module.exports = {
  db_connection,
};
