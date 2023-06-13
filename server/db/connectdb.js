const mongoose = require("mongoose");

const connectdb = async () => {
  await mongoose
    .connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(
        "Connected to MongoDB.",
        `MongoPort : ${mongoose.connection.host}`
      );
    })
    .catch((err) => {
      console.log(err);
      process.exit();
    });
};

module.exports = connectdb;
