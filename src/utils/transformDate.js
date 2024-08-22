function formatDate(timestamp) {
  // Convert the timestamp to a Date object
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds

  // Extract components
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");

  // Format the date and time as `yyyy-MM-dd HH:mm:ss.SSS+0000`
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+0000`;
}

module.exports = formatDate;
