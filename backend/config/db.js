const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB Connected", con.connection.host);
  } catch (err) {
    console.log("Error to connect Mongo DB", err);
    process.emit();
  }
};

module.exports = connectDb;
