# Regulus SDK

The **Regulus SDK** is a Node.js library designed to simplify integration with the Regulus API. It provides tools for securely sending transaction data and interacting with the Regulus platform. With built-in validation and streamlined HTTP requests, Regulus SDK makes it easy to build reliable applications.

---

## Features

- Simple setup and initialization
- Robust transaction validation
- Built-in HTTP client with error handling
- Secure API communication
- Zero configuration needed for API endpoint

---

## Installation

Install the SDK via npm:

```bash
npm install regulus-sdk
```

## Setup

### Environment Variables

Create a `.env` file in your project root and add the following variables:

```env
API_KEY=your-api-key
ORGANIZATION_ID=your-organization-id
```

Replace the placeholder values with the credentials provided by Regulus.

## Usage

### Import and Initialize the SDK

```javascript
const RegulusSDK = require('regulus-sdk');

// Initialize the SDK
const apiKey = process.env.API_KEY; 
const organizationId = process.env.ORGANIZATION_ID;

const sdk = new RegulusSDK(apiKey, organizationId);
```

### Example: Sending a Transaction

```javascript
const transactionData = {
  transaction_id: "txn_12345",
  user_id: "user_001",
  amount: 1000,
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
```

## API Reference

### `RegulusSDK(apiKey, organizationId)`

**Description:** Creates an instance of the SDK.

**Parameters:**
- `apiKey` (string): Your API key
- `organizationId` (string): Your organization ID

### `sdk.sendTransaction(transactionData)`

**Description:** Sends a transaction to the Regulus API.

**Parameters:**
- `transactionData` (object): An object containing the transaction details.
  - `transaction_id` (string, required): Unique transaction ID
  - `user_id` (string, required): User ID associated with the transaction
  - `amount` (number, required): Transaction amount (must be positive)
  - `currency` (string, required): 3-letter currency code (e.g., USD)
  - `country` (string, required): Country code (e.g., US)
  - `timestamp` (string, required): ISO 8601 formatted timestamp

**Returns:** A promise resolving to the API response.

## Project Structure

```
src/
  ├── httpClient.js       # HTTP client for API requests
  ├── index.js           # Main entry point for the SDK
  ├── testSdk.js        # Example script for testing the SDK
  ├── validators.js      # Validation logic for transaction data
dist/                    # Built and optimized files for distribution
.env                     # Environment variables (not included in the repository)
package.json            # Project metadata and dependencies
README.md              # Documentation
```

## Running Tests

This project uses Jest for testing. To run tests, use the following command:

```bash
npm test
```

To check code coverage, Jest will automatically generate a coverage report.

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Submit a pull request with a detailed description of your changes

## Keywords

fraud-detection, transaction-monitoring, risk-management, fintech, payment-processing, nodejs-sdk, api-client, security, compliance, real-time-monitoring, fraud-prevention, transaction-analysis, risk-assessment, financial-security, payment-validation, regulus, anti-fraud, transaction-security, fraud-scoring, risk-scoring

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Support

For support, please contact support@getregulus.co

## Main Repository

For more information, documentation, and source code, please visit the [Regulus Backend Repository](https://github.com/getregulus/regulus-be).
