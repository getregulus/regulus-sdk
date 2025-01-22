const HttpClient = require('./httpClient');
const Validators = require('./validators');

class RegulusSDK {
  constructor(apiKey, organizationId, baseUrl) {
    if (!apiKey) throw new Error("API Key is required");
    if (!organizationId) throw new Error("Organization ID is required");
    if (!baseUrl) throw new Error("Base URL is required"); 
    this.httpClient = new HttpClient(baseUrl, apiKey, organizationId);
  }

  async sendTransaction(transactionData) {
    try {
      Validators.validateTransactionData(transactionData);
      const response = await this.httpClient.post('/transactions', transactionData);
      return response;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

module.exports = RegulusSDK;
