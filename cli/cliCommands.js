// node cli/cliCommands.js pay_with shift4 --amount 100 --currency USD --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123
// node cli/cliCommands.js pay_with aci --amount 100 --currency EUR --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123
// node cli/cliCommands.js get_payment_status --payment_id 60483844-4865-4e10-a3d3-05c9959975c1


const { Command } = require("commander");
const axios = require("axios");
const logger = require("../src/config/logger");

require('dotenv').config(); // Load environment variables from a .env file

// Use environment variables for the host and port, with defaults if not set
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const BASE_URL = `http://${HOST}:${PORT}/api/v1`;

const program = new Command();

program
  .command("pay_with <gateway>")
  .option("--amount <amount>")
  .option("--currency <currency>")
  .option("--card_number <cardNumber>")
  .option("--expiry_date <expiryDate>")
  .option("--cvv <cvv>")
  .action(async (gateway, options) => {
    const [expMonth, expYear] = options.expiry_date.split("/");
    try {
      const response = await axios.post(
        `${BASE_URL}/payments/${gateway}`,
        {
          amount: options.amount,
          currency: options.currency,
          cardNumber: options.card_number,
          expMonth,
          expYear,
          cvv: options.cvv,
        }
      );
      console.log(response.data);
      logger.info("Payment processed:");
    } catch (error) {
      logger.error( `Error processing payment: ${error.response.data}`)
      console.error();
    }
  });

program
  .command("get_payment_status")
  .option("--payment_id <id>")
  .action(async (options) => {
    try {
      const response = await axios.get(
       `${BASE_URL}/payments/${options.payment_id}`
      );
      console.log("Payment status:", response.data);
    } catch (error) {
      console.error("Error retrieving payment status:", error.response.data);
    }
  });

program.parse(process.argv);
