const mongoose = require("mongoose");

/*
========================================
MONGODB CONNECTION
========================================
*/

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error(
        "MONGO_URI is missing in .env"
      );
    }

    const connection =
      await mongoose.connect(
        mongoURI
      );

    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error.message
    );

    process.exit(1);
  }
};

/*
========================================
MONGOOSE EVENTS
========================================
*/

mongoose.connection.on(
  "disconnected",
  () => {
    console.log(
      "MongoDB disconnected"
    );
  }
);

mongoose.connection.on(
  "reconnected",
  () => {
    console.log(
      "MongoDB reconnected"
    );
  }
);

mongoose.connection.on(
  "error",
  (error) => {
    console.error(
      "MongoDB error:",
      error
    );
  }
);

module.exports =
  connectDB;