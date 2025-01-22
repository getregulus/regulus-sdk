const HttpClient = require("../httpClient");
const axios = require("axios");

jest.mock("axios");

describe("HttpClient", () => {
  const baseUrl = "http://localhost:3000";
  const token = "test_token";
  const organizationId = "test_organization_id";

  beforeAll(() => {
    axios.create.mockImplementation(({ baseURL, timeout }) => ({
      defaults: {
        baseURL,
        timeout, // Use the provided timeout value
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Organization-ID": organizationId,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
      interceptors: {
        response: {
          use: jest.fn((resolve, reject) => {
            resolve = jest.fn((response) => response);
            reject = jest.fn((error) => Promise.reject(error));
          }),
        },
      },
      post: jest.fn((endpoint, data) => {
        if (endpoint === "/error") {
          return Promise.reject({
            response: {
              status: 500,
              data: { message: "Mocked Network Error" },
            },
          });
        }
        return Promise.resolve({ data: "Mocked Response" });
      }),
    }));
  });  

  test("should handle a successful POST request", async () => {
    const client = new HttpClient(baseUrl, token, organizationId);
    const data = { key: "value" };

    const response = await client.post("/test", data);
    expect(response).toBe("Mocked Response");
  });

  test("should handle a failed POST request", async () => {
    const client = new HttpClient(baseUrl, token, organizationId);

    await expect(client.post("/error", {})).rejects.toThrow(
      "POST /error failed: Mocked Network Error"
    );
  });

  test("should throw an error if base URL is missing", () => {
    expect(() => new HttpClient(null, token, organizationId)).toThrow(
      "Base URL is required"
    );
  });

  test("should throw an error if token is missing", () => {
    expect(() => new HttpClient(baseUrl, null, organizationId)).toThrow(
      "JWT Token is required"
    );
  });

  test("should throw an error if organization ID is missing", () => {
    expect(() => new HttpClient(baseUrl, token, null)).toThrow(
      "Organization ID is required"
    );
  });

  test("should initialize with correct headers", () => {
    const client = new HttpClient(baseUrl, token, organizationId);
    expect(client.client.defaults.baseURL).toBe(baseUrl);
    expect(client.client.defaults.headers.Authorization).toBe(`Bearer ${token}`);
    expect(client.client.defaults.headers["X-Organization-ID"]).toBe(organizationId);
  });

  test("should set custom headers", () => {
    const client = new HttpClient(baseUrl, token, organizationId);
    client.setHeaders({ "Custom-Header": "CustomValue" });

    expect(client.client.defaults.headers["Custom-Header"]).toBe("CustomValue");
  });

  test("should log error for 401 Unauthorized", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    const client = new HttpClient(baseUrl, token, organizationId);

    const interceptorErrorHandler = client.client.interceptors.response.use.mock.calls[0][1];
    try {
      await interceptorErrorHandler({ response: { status: 401, data: { message: "Unauthorized" } } });
    } catch (error) {
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Unauthorized: Please check your credentials or organization ID"
      );
    }
    consoleErrorMock.mockRestore();
  });

  test("should log error for 400 Bad Request", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    const client = new HttpClient(baseUrl, token, organizationId);

    const interceptorErrorHandler = client.client.interceptors.response.use.mock.calls[0][1];
    try {
      await interceptorErrorHandler({
        response: { status: 400, data: { message: "Bad Request Error" } },
      });
    } catch (error) {
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Bad Request:", "Bad Request Error"
      );
    }
    consoleErrorMock.mockRestore();
  });

  test("should handle unknown error in interceptor", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    const client = new HttpClient(baseUrl, token, organizationId);

    const interceptorErrorHandler = client.client.interceptors.response.use.mock.calls[0][1];
    try {
      await interceptorErrorHandler({});
    } catch (error) {
      expect(consoleErrorMock).not.toHaveBeenCalled();
    }
    consoleErrorMock.mockRestore();
  });

  test("should set custom timeout value", () => {
    const timeout = 60000; // 60 seconds
    const client = new HttpClient(baseUrl, token, organizationId, timeout);
    expect(client.client.defaults.timeout).toBe(timeout);
  });
  
  test("should use default timeout when not provided", () => {
    const client = new HttpClient(baseUrl, token, organizationId);
    expect(client.client.defaults.timeout).toBe(120000); // Default 2 minutes
  });
  
  test("should handle setting headers with no arguments", () => {
    const client = new HttpClient(baseUrl, token, organizationId);
    client.setHeaders();
    expect(client.client.defaults.headers["Custom-Header"]).toBeUndefined();
  });

  test("should handle error in interceptor with no response", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    const client = new HttpClient(baseUrl, token, organizationId);
  
    const interceptorErrorHandler = client.client.interceptors.response.use.mock.calls[0][1];
    try {
      await interceptorErrorHandler({}); // No `response` field
    } catch (error) {
      expect(consoleErrorMock).not.toHaveBeenCalled();
    }
    consoleErrorMock.mockRestore();
  });
  
  test("should handle error in interceptor with no response data", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    const client = new HttpClient(baseUrl, token, organizationId);
  
    const interceptorErrorHandler = client.client.interceptors.response.use.mock.calls[0][1];
    try {
      await interceptorErrorHandler({ response: {} }); // Missing `data`
    } catch (error) {
      expect(consoleErrorMock).not.toHaveBeenCalled();
    }
    consoleErrorMock.mockRestore();
  });
});
