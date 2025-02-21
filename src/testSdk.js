const result = require('dotenv').config({ path: '../.env' });
if (result.error) {
  throw new Error("Failed to load .env file");
}

const RegulusSDK = require("./index");

const apiKey = process.env.API_KEY;
const organizationId = process.env.ORGANIZATION_ID;

const sdk = new RegulusSDK(apiKey, organizationId);

const transactionData = {
  transaction_id: "txn_009819",
  user_id: "user_002",
  amount: 3000000,
  currency: "USD",
  country: "US",
  timestamp: new Date().toISOString(),
};

(async () => {
  try {
    const response = await sdk.sendTransaction(transactionData);
    console.log("Transaction sent successfully:", response);
  } catch (error) {
    console.error("Error sending transaction:", error.message);
  }
})();
