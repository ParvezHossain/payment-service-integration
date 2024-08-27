module.exports = {
    success(message, data) {
      return { status: "success", message, data };
    },
    error(message) {
      return { status: "error", message };
    },
  };
  