/* pay_with shift4 --amount 100 --currency USD --card_number 4111111111111111 --expiry_date 12/23 --cvv 123
pay_with aci --amount 100 --currency USD --card_number 4111111111111111 --expiry_date 12/23 --cvv 123
get_payment_status --payment_id 12345
 */

// node cli/cliCommands.js pay_with shift4 --amount 100 --currency USD --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123
// node cli/cliCommands.js pay_with aci --amount 100 --currency USD --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123
// node cli/cliCommands.js get_payment_status --payment_id 1234556

const { Command } = require("commander");
const axios = require("axios");

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
        `http://localhost:3000/api/v1/payments/${gateway}`,
        {
          amount: options.amount,
          currency: options.currency,
          cardNumber: options.card_number,
          expMonth,
          expYear,
          cvv: options.cvv,
        }
      );
      console.log("Payment processed:", response.data);
    } catch (error) {
      console.error("Error processing payment:", error.response.data);
    }
  });

program
  .command("get_payment_status")
  .option("--payment_id <id>")
  .action(async (options) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/payments/${options.payment_id}`
      );
      console.log("Payment status:", response.data);
    } catch (error) {
      console.error("Error retrieving payment status:", error.response.data);
    }
  });

program.parse(process.argv);
