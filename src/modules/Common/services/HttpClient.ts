/**
 * HttpClient — thin typed wrapper around native fetch.
 * Supports interceptors, retries, auth headers, centralized errors.
 *
 * In production this hits a real API. For this demo we register an
 * in-memory request handler (see MockBackend) which intercepts fetch.
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface HttpRequestConfig {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  retries?: number;
  signal?: AbortSignal;
}

export type RequestInterceptor = (
  url: string,
  init: RequestInit,
) => RequestInit | Promise<RequestInit>;

export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
  ) {
    super(`HTTP ${status} ${statusText}`);
  }
}

class HttpClientImpl {
  private baseUrl = "";
  private authToken: string | null = null;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  configure(opts: { baseUrl?: string }) {
    if (opts.baseUrl) this.baseUrl = opts.baseUrl;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  addRequestInterceptor(fn: RequestInterceptor) {
    this.requestInterceptors.push(fn);
  }

  addResponseInterceptor(fn: ResponseInterceptor) {
    this.responseInterceptors.push(fn);
  }

  get<T>(path: string, config?: HttpRequestConfig) {
    return this.request<T>(path, { ...config, method: "GET" });
  }
  post<T>(path: string, body?: unknown, config?: HttpRequestConfig) {
    return this.request<T>(path, { ...config, method: "POST", body });
  }
  put<T>(path: string, body?: unknown, config?: HttpRequestConfig) {
    return this.request<T>(path, { ...config, method: "PUT", body });
  }
  delete<T>(path: string, config?: HttpRequestConfig) {
    return this.request<T>(path, { ...config, method: "DELETE" });
  }

  private async request<T>(path: string, config: HttpRequestConfig): Promise<T> {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
      ...(config.headers ?? {}),
    };

    let init: RequestInit = {
      method: config.method ?? "GET",
      headers,
      signal: config.signal,
      body: config.body !== undefined ? JSON.stringify(config.body) : undefined,
    };

    for (const it of this.requestInterceptors) {
      init = await it(url, init);
    }

    const retries = config.retries ?? 0;
    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        let response = await fetch(url, init);
        for (const it of this.responseInterceptors) {
          response = await it(response);
        }
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          let parsed: unknown = text;
          try {
            parsed = JSON.parse(text);
          } catch {
            /* keep text */
          }
          throw new HttpError(response.status, response.statusText, parsed);
        }
        if (response.status === 204) return undefined as T;
        return (await response.json()) as T;
      } catch (err) {
        lastError = err;
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  }
}

const httpClient = new HttpClientImpl();
export { httpClient as HttpClient };
