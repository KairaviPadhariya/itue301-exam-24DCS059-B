const path = require("path");
// Load .env from the backend folder no matter where the command is run from
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");

module.exports = async function connect() {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes("your_mongodb")) {
    throw new Error("MONGO_URI is missing. Add a valid MongoDB connection string to backend/.env.");
  }
  let parsed;
  try {
    parsed = new URL(uri);
    if (!["mongodb:", "mongodb+srv:"].includes(parsed.protocol) || !parsed.hostname) throw new Error();
  } catch {
    throw new Error("MONGO_URI is invalid. Use a mongodb:// or mongodb+srv:// connection string in backend/.env.");
  }
  const hasDatabaseName = parsed.pathname && parsed.pathname !== "/";
  const options = { serverSelectionTimeoutMS: 8000 };
  if (!hasDatabaseName) options.dbName = process.env.DB_NAME || "eventhub";
  try {
    await mongoose.connect(uri, options);
  } catch (err) {
    const reason = err.message || "Unknown connection error";
    let help = "Check the MongoDB connection string and network access.";
    if (/authentication|auth failed|bad auth/i.test(reason)) help = "The MongoDB username or password is incorrect.";
    else if (/getaddrinfo|ENOTFOUND|querySrv|ECONNREFUSED/i.test(reason)) help = "MongoDB DNS/SRV lookup or network connection failed; check the host and connection string.";
    else if (/timed out|server selection/i.test(reason)) help = "MongoDB could not be reached. Check that your IP is whitelisted in Atlas and that the cluster is available.";
    throw new Error(`MongoDB connection failed: ${help} Details: ${reason}`);
  }
  console.log(`MongoDB connected -> database "${mongoose.connection.name}"`);
};
