class Validators {
  static validateTransactionData(transactionData) {
    if (!transactionData.transaction_id) {
      throw new Error("Missing required field: transaction_id");
    }
    if (!transactionData.user_id) {
      throw new Error("Missing required field: user_id");
    }
    if (!transactionData.amount) {
      throw new Error("Missing required field: amount");
    }
    if (typeof transactionData.amount !== "number" || transactionData.amount <= 0) {
      throw new Error("Amount must be a positive number");
    }
    if (!transactionData.currency) {
      throw new Error("Missing required field: currency");
    }
    if (transactionData.currency.length !== 3) {
      throw new Error("Currency must be a 3-letter code");
    }
    if (!transactionData.country) {
      throw new Error("Missing required field: country");
    }
    if (!transactionData.timestamp) {
      throw new Error("Missing required field: timestamp");
    }
    if (isNaN(Date.parse(transactionData.timestamp))) {
      throw new Error("Timestamp must be a valid date");
    }
  }
}

module.exports = Validators;
