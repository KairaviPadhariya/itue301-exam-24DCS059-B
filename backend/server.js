const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => console.log(`Event Hub API running on port ${PORT}`));

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to another port.`);
    process.exitCode = 1;
    return;
  }
  console.error("Failed to start Event Hub API:", err.message);
  process.exitCode = 1;
});
