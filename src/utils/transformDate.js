function formatDate(timestamp) {
  // Convert the timestamp to a Date object
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds

  // Format the date as dd-month-year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  // Return the formatted date
  return `${day}-${month}-${year}`;
}

module.exports = formatDate;
