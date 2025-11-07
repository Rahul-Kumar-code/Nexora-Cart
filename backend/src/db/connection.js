const mongoose = require("mongoose");

let databaseEnabled = false;

async function connectToDatabase(uri, options = {}) {
  const { requireDatabase = false } = options;

  if (!uri) {
    const message = "MongoDB URI not provided. Set MONGO_URI to enable database persistence.";
    if (requireDatabase) {
      throw new Error(message);
    }
    console.warn(`${message} Falling back to in-memory storage.`);
    return false;
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    databaseEnabled = true;
    console.info("Connected to MongoDB");
    return true;
  } catch (error) {
    const message = `MongoDB connection failed: ${error.message}`;
    if (requireDatabase) {
      throw new Error(message);
    }
    console.error(`${message}. Falling back to in-memory storage.`);
    return false;
  }
}

function isDatabaseEnabled() {
  return databaseEnabled;
}

module.exports = {
  connectToDatabase,
  isDatabaseEnabled
};
