const Validators = require("../validators");

describe("Validators", () => {
  test("should validate valid transaction data successfully", () => {
    const validData = {
      transaction_id: "txn_001",
      user_id: "user_001",
      amount: 100,
      currency: "USD",
      country: "US",
      timestamp: new Date().toISOString(),
    };

    expect(() => Validators.validateTransactionData(validData)).not.toThrow();
  });

  test("should throw an error for missing transaction_id", () => {
    const invalidData = {
      user_id: "user_001",
      amount: 100,
      currency: "USD",
      country: "US",
      timestamp: new Date().toISOString(),
    };

    expect(() => Validators.validateTransactionData(invalidData)).toThrow(
      "Missing required field: transaction_id"
    );
  });

  test("should throw an error for missing user_id", () => {
    const invalidData = {
      transaction_id: "txn_001",
      amount: 100,
      currency: "USD",
      country: "US",
      timestamp: new Date().toISOString(),
    };

    expect(() => Validators.validateTransactionData(invalidData)).toThrow(
      "Missing required field: user_id"
    );
  });

  test("should throw an error for missing amount", () => {
    const invalidData = {
      transaction_id: "txn_001",
      user_id: "user_001",
      currency: "USD",
      country: "US",
      timestamp: new Date().toISOString(),
    };

    expect(() => Validators.validateTransactionData(invalidData)).toThrow(
      "Missing required field: amount"
    );
  });

  test("should throw an error for negative amount", () => {
    const invalidData = {
      transaction_id: "txn_001",
      user_id: "user_001",
      amount: -100,
      currency: "USD",
      country: "US",
      timestamp: new Date().toISOString(),
    };

    expect(() => Validators.validateTransactionData(invalidData)).toThrow(
      "Amount must be a positive number"
    );
  });

  test("should throw an error for missing currency", () => {
    const invalidData = {
      transaction_id: "txn_001",
      user_id: "user_001",
      amount: 100,
      country: "US",
      timestamp: new Date().toISOString(),
    };

    expect(() => Validators.validateTransactionData(invalidData)).toThrow(
      "Missing required field: currency"
    );
  });

  test("should throw an error for invalid currency code", () => {
    const invalidData = {
      transaction_id: "txn_001",
      user_id: "user_001",
      amount: 100,
      currency: "USDA",
      country: "US",
      timestamp: new Date().toISOString(),
    };

    expect(() => Validators.validateTransactionData(invalidData)).toThrow(
      "Currency must be a 3-letter code"
    );
  });

  test("should throw an error for missing country", () => {
    const invalidData = {
      transaction_id: "txn_001",
      user_id: "user_001",
      amount: 100,
      currency: "USD",
      timestamp: new Date().toISOString(),
    };

    expect(() => Validators.validateTransactionData(invalidData)).toThrow(
      "Missing required field: country"
    );
  });

  test("should throw an error for missing timestamp", () => {
    const invalidData = {
      transaction_id: "txn_001",
      user_id: "user_001",
      amount: 100,
      currency: "USD",
      country: "US",
    };

    expect(() => Validators.validateTransactionData(invalidData)).toThrow(
      "Missing required field: timestamp"
    );
  });

  test("should throw an error for invalid timestamp", () => {
    const invalidData = {
      transaction_id: "txn_001",
      user_id: "user_001",
      amount: 100,
      currency: "USD",
      country: "US",
      timestamp: "invalid-date",
    };

    expect(() => Validators.validateTransactionData(invalidData)).toThrow(
      "Timestamp must be a valid date"
    );
  });
});
