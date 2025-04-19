import type {
  BodyType,
  InterceptorHooks,
  MiddlewareContext,
  RequestConfig,
} from '@/libs/Http/domain/types.ts';

export class HttpClient {
  private baseURL: string;
  private fetchFn: typeof fetch;
  public interceptors: InterceptorHooks<unknown>;
  private defaultConfig: RequestConfig;
  private controllers: Set<AbortController> = new Set();

  constructor(
    baseURL: string,
    options: {
      fetchFn?: typeof fetch;
      interceptors?: InterceptorHooks<unknown>;
      defaultConfig?: RequestConfig;
    } = {}
  ) {
    this.baseURL = baseURL.replace(/\/+$/, '');
    this.fetchFn = options.fetchFn ?? fetch.bind(globalThis);
    this.interceptors = options.interceptors ?? {};
    this.defaultConfig = options.defaultConfig ?? {};
  }

  private async request<T>(
    method: string,
    url: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const merged = { ...this.defaultConfig, ...config };
    const fullUrl = url.startsWith('http')
      ? url
      : `${this.baseURL}/${url.replace(/^\/+/, '')}`;
    const controller = new AbortController();
    this.controllers.add(controller);
    const init: RequestInit = {
      method,
      signal: controller.signal,
      headers: { ...(merged.headers ?? {}) },
    };

    if (merged.body != null) {
      if (
        typeof merged.body === 'object' &&
        !(merged.body instanceof FormData)
      ) {
        init.headers = { 'Content-Type': 'application/json', ...init.headers };
        init.body = JSON.stringify(merged.body);
      } else {
        init.body = merged.body as BodyInit;
      }
    }

    const ctx: MiddlewareContext<T> = { url: fullUrl, init };

    try {
      await this.interceptors.onRequest?.(ctx);
    } catch (error) {
      ctx.error = error as Error;
      await this.interceptors.onRequestError?.(ctx);
      this.controllers.delete(controller);
      throw error;
    }

    let response: Response;

    try {
      response = await this.fetchFn(fullUrl, init);
      ctx.response = response;
    } catch (error) {
      ctx.error = error as Error;
      await this.interceptors.onRequestError?.(ctx);
      this.controllers.delete(controller);
      throw error;
    }

    if (!response.ok) {
      const err = new Error(response.statusText || `HTTP ${response.status}`);
      ctx.error = err;
      await this.interceptors.onResponseError?.(ctx);
      this.controllers.delete(controller);
      throw err;
    }

    switch (merged.responseType ?? 'json') {
      case 'text':
        ctx.data = (await response.text()) as T;
        break;
      case 'blob':
        ctx.data = (await response.blob()) as T;
        break;
      case 'arrayBuffer':
        ctx.data = (await response.arrayBuffer()) as T;
        break;
      case 'formData':
        ctx.data = (await response.formData()) as T;
        break;
      case 'json':
      default:
        ctx.data = (await response.json()) as T;
    }

    try {
      await this.interceptors.onResponse?.(ctx);
    } catch {
      // ignore interceptor errors
    }

    this.controllers.delete(controller);
    return ctx.data as T;
  }

  public get<T = unknown>(
    url: string,
    config?: Omit<RequestConfig, 'body'>
  ): Promise<T> {
    return this.request('GET', url, config ?? {});
  }

  public post<T = unknown>(
    url: string,
    body?: BodyType,
    config?: Omit<RequestConfig, 'body'>
  ): Promise<T> {
    return this.request('POST', url, { ...(config ?? {}), body });
  }

  public put<T = unknown>(
    url: string,
    body?: BodyType,
    config?: Omit<RequestConfig, 'body'>
  ): Promise<T> {
    return this.request('PUT', url, { ...(config ?? {}), body });
  }

  public patch<T = unknown>(
    url: string,
    body?: BodyType,
    config?: Omit<RequestConfig, 'body'>
  ): Promise<T> {
    return this.request('PATCH', url, { ...(config ?? {}), body });
  }

  public delete<T = unknown>(
    url: string,
    config?: Omit<RequestConfig, 'body'>
  ): Promise<T> {
    return this.request('DELETE', url, config ?? {});
  }

  public abort(): void {
    for (const controller of this.controllers) controller.abort();
    this.controllers.clear();
  }
}

export function createHttpClient(
  baseURL: string,
  options?: {
    fetchFn?: typeof fetch;
    interceptors?: InterceptorHooks<unknown>;
    defaultConfig?: RequestConfig;
  }
): HttpClient {
  return new HttpClient(baseURL, options);
}
