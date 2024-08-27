const { Command } = require("commander");
const paymentCommandHandler = require("./commandHander/payment");
const logger = require("../config/logger");

const program = new Command();

// Process payment command
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
      const pyament = await paymentCommandHandler.payment(
        {
          amount: options.amount,
          currency: options.currency,
          cardNumber: options.card_number,
          expMonth,
          expYear,
          cvv: options.cvv,
        },
        gateway
      );
      logger.info("Payment processed successfully");
      logger.info(JSON.stringify(pyament, null, 2));
    } catch (error) {
      logger.error(`Failed to processing payment`);
      logger.error(error);
      console.log(error);
    }
  });

//Process payment status retrive command
program
  .command("get_payment_status")
  .option("--payment_id <id>")
  .action(async (options) => {
    try {
      const { payment_id } = options;
      const paymentStatus = await paymentCommandHandler.status(payment_id);
      logger.info(JSON.stringify(paymentStatus, null, 2));
    } catch (error) {
      logger.error(`Failed to get payment staus`);
      logger.error(error);
    }
  });

/**
 * Starts and runs the CLI program.
 *
 * @param {string[]} argv - An array of command-line arguments.
 *                          Typically, this is passed as process.argv.
 *                          Example: ['node', 'script.js', '--option', 'value']
 */
function run(argv) {
  program.parse(argv);
}

module.exports = { run };
