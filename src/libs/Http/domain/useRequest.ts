import type { HttpClient } from './client';
import { createHttpClient } from './client';
import type { BodyType, InterceptorHooks, RequestConfig } from './types';

export type UseRequestOptions = {
  baseURL: string;
  fetchFn?: typeof fetch;
  interceptors?: InterceptorHooks<unknown>;
  defaultConfig?: RequestConfig;
};

export type UseRequestReturn = {
  get: <T = unknown>(
    url: string,
    config?: Omit<RequestConfig, 'body'>
  ) => Promise<T>;
  post: <T = unknown>(
    url: string,
    body?: BodyType,
    config?: Omit<RequestConfig, 'body'>
  ) => Promise<T>;
  put: <T = unknown>(
    url: string,
    body?: BodyType,
    config?: Omit<RequestConfig, 'body'>
  ) => Promise<T>;
  patch: <T = unknown>(
    url: string,
    body?: BodyType,
    config?: Omit<RequestConfig, 'body'>
  ) => Promise<T>;
  delete: <T = unknown>(
    url: string,
    config?: Omit<RequestConfig, 'body'>
  ) => Promise<T>;
  abort: () => void;
};

/**
 * standalone request client
 * framework-agnostic
 */
export function useRequest(
  baseURL: string,
  options: Omit<UseRequestOptions, 'baseURL'> = {}
): UseRequestReturn {
  const { fetchFn, interceptors: rawInterceptors, defaultConfig } = options;

  const interceptors = rawInterceptors ? rawInterceptors : undefined;

  const client: HttpClient = createHttpClient(baseURL, {
    fetchFn,
    interceptors,
    defaultConfig,
  });

  return {
    get: client.get.bind(client),
    post: client.post.bind(client),
    put: client.put.bind(client),
    patch: client.patch.bind(client),
    delete: client.delete.bind(client),
    abort: client.abort.bind(client),
  };
}
