const logger = require("./logger");

const sqlite3 = require("sqlite3").verbose();
// Create and configure SQLite database
const dbName = "transaction_history.db";
const db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to database");
    // Create the table
    db.serialize(() => {
      db.run(
        `
        CREATE TABLE IF NOT EXISTS records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          custom_tnx_id TEXT NOT NULL UNIQUE,
          tnx_id TEXT NOT NULL,
          payment_type TEXT NOT NULL,
          tnx_details TEXT NULL 
          );
        `,
        (err) => {
          if (err) {
            logger.error(`Failed to create records table: ${err.message}`);
          } else {
            logger.info(
              "Successfully created the records table or table already exists"
            );
          }
        }
      );
    });
  }
});

module.exports = db;
