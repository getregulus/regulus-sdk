const HttpClient = require("../httpClient");
const Validators = require("../validators");
const RegulusSDK = require("../index");

jest.mock("../httpClient");
jest.mock("../validators");

describe("RegulusSDK", () => {
  let sdk;
  const apiKey = "test_api_key";
  const organizationId = "test_organization_id";
  const baseUrl = "http://localhost:3000";

  beforeEach(() => {
    sdk = new RegulusSDK(apiKey, organizationId, baseUrl);
  });

  test("should initialize with correct parameters", () => {
    expect(sdk.httpClient).toBeInstanceOf(HttpClient);
  });

  test("should throw an error if API key is missing", () => {
    expect(() => new RegulusSDK(null, organizationId, baseUrl)).toThrow("API Key is required");
  });

  test("should throw an error if organization ID is missing", () => {
    expect(() => new RegulusSDK(apiKey, null, baseUrl)).toThrow("Organization ID is required");
  });


  test("should throw an error if base URL is missing", () => {
    expect(() => new RegulusSDK(apiKey, organizationId, null)).toThrow("Base URL is required");
  });

  test("should send transaction successfully", async () => {
    const transactionData = {
      transaction_id: "txn_00981",
      user_id: "user_002",
      amount: 3000000,
      currency: "USD",
      country: "US",
      timestamp: new Date().toISOString(),
    };

    Validators.validateTransactionData.mockImplementation(() => {});
    HttpClient.prototype.post.mockResolvedValue({ success: true });

    const response = await sdk.sendTransaction(transactionData);
    expect(response).toEqual({ success: true });
    expect(Validators.validateTransactionData).toHaveBeenCalledWith(transactionData);
    expect(HttpClient.prototype.post).toHaveBeenCalledWith("/transactions", transactionData);
  });
  test("should throw an error when sending transaction fails", async () => {
    const transactionData = {
      transaction_id: "txn_00981",
      user_id: "user_002",
      amount: 3000000,
      currency: "USD",
      country: "US",
      timestamp: new Date().toISOString(),
    };

    Validators.validateTransactionData.mockImplementation(() => {});
    HttpClient.prototype.post.mockRejectedValue(new Error("Network Error"));

    await expect(sdk.sendTransaction(transactionData)).rejects.toThrow("Network Error");
  });

  test("should throw an error for 401 Unauthorized", async () => {
    HttpClient.prototype.post.mockRejectedValue({
      response: { status: 401, data: { message: "Unauthorized" } },
    });
  
    await expect(sdk.sendTransaction({})).rejects.toThrow("Unauthorized");
  });

  test("should throw an error for 500 Server Error", async () => {
    HttpClient.prototype.post.mockRejectedValue({
      response: { status: 500, data: { message: "Internal Server Error" } },
    });

    await expect(sdk.sendTransaction({})).rejects.toThrow("Internal Server Error");
  });
});