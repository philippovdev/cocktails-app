export type BodyType = BodyInit | Record<string, unknown> | null | undefined;

export type ResponseType =
  | 'json'
  | 'text'
  | 'blob'
  | 'arrayBuffer'
  | 'formData';

export type RequestConfig = Omit<RequestInit, 'signal' | 'body'> & {
  body?: BodyType;
  responseType?: ResponseType;
};

export type MiddlewareContext<T = unknown> = {
  url: string;
  init: RequestInit;
  response?: Response;
  data?: T;
  error?: Error;
};

export type Middleware<T = unknown> = (
  ctx: MiddlewareContext<T>
) => Promise<void> | void;

export type InterceptorHooks<T = unknown> = {
  onRequest?: Middleware<T>;
  onResponse?: Middleware<T>;
  onRequestError?: Middleware<T>;
  onResponseError?: Middleware<T>;
};
