const mongoose = require("mongoose");
const connect = require("./db");
const Event = require("./models/Event");
const { formatValidationError } = require("./utils/formatError");

(async () => {
  try {
    await connect();

    // 1) One valid event -> saved
    const saved = await Event.create({
      title: "Hack Night",
      date: "2026-11-05",
      category: "tech",
      capacity: 30,
      fee: 100,
    });
    console.log(`Saved to database "${mongoose.connection.name}", collection "${Event.collection.name}", _id ${saved._id}`);
    const reread = await Event.findById(saved._id);
    console.log("Re-read saved event:", reread ? reread.toObject() : null);
    console.log('View the data in database "eventhub", collection "events".');
    console.log("Documents in collection now:", await Event.countDocuments());

    // 2) One invalid event -> formatted error
    try {
      await Event.create({ title: "", date: "banana", category: "cultural", capacity: 300, fee: -5 });
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        console.log("Invalid event rejected:");
        console.log(JSON.stringify(formatValidationError(err), null, 2));
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
