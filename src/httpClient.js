const axios = require('axios');

class HttpClient {
  constructor(baseUrl, apiKey, organizationId, timeout = 120000) {
    if (!baseUrl) throw new Error("Base URL is required");
    if (!apiKey) throw new Error("API Key is required");
    if (!organizationId) throw new Error("Organization ID is required");

    this.organizationId = organizationId;

    this.client = axios.create({
      baseURL: baseUrl,
      timeout: timeout,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-Organization-ID': this.organizationId,
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const res = error.response;
        if (res?.status === 401) {
          console.error('Unauthorized: Please check your API key or organization ID');
        } else if (res?.status === 400) {
          console.error('Bad Request:', res.data?.message || res.status);
        }
        return Promise.reject(error);
      }
    );
  }

  setHeaders(headers) {
    this.client.defaults.headers = { ...this.client.defaults.headers, ...headers };
  }

  async post(endpoint, data) {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      throw new Error(`POST ${endpoint} failed: ${errorMessage}`);
    }
  }
}

module.exports = HttpClient;
