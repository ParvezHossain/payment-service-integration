const app = require("./web/app");

// Start the server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on http://${HOST}:${PORT}`
  );
});

module.exports = app;
