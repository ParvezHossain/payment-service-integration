const aciService = require("./aciService");
const shift4Service = require("./shift4Service");

class PaymentServiceFactory {
  static getService(paymentType) {
    if (!paymentType) return null;
    paymentType = paymentType.toLowerCase();
    const services = {
      shift4: shift4Service,
      aci: aciService,
    };
    return services[paymentType];
  }
}
module.exports = { PaymentServiceFactory };
