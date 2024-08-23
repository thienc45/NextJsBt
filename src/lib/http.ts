import { LoginResType } from "@/app/schemaValidations/auth.schema";

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

class HttpError extends Error {
  status: number;
  payload: any;
  constructor(status: number, payload: any) {
    super("HTTP Error");
    this.status = status;
    this.payload = payload;
  }
}

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions
): Promise<{ status: number; payload: Response }> => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeader = {
    "Content-Type": "application/json",
    Authorization: clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : ''

  };
  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;
  const fullURL = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;
  console.log(options?.body);
  console.log(JSON.stringify(options?.body));
  const response = await fetch(fullURL, {
    method,
    headers: { ...baseHeader, ...options?.headers },
    ...options,
    body: JSON.stringify(options?.body),
  });

  const payload = await response.json();

  const data = {
    status: response.status,
    payload,
  };

  console.log(response.ok);
  if (!response.ok) {
    throw new HttpError(response.status, payload);
  }
  console.log(data);

  if(['/auth/login', '/auth/register'].includes(url)){
    clientSessionToken.value = (payload as LoginResType).data.token
  }

  return data;
};

class SessionToken {
  private token = "";

  get value() {
    return this.token;
  }

  set value(token: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.token = token;
  }
}

export const clientSessionToken = new SessionToken();

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body">
  ): Promise<{ status: number; payload: Response }> {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: CustomOptions
  ): Promise<{ status: number; payload: Response }> {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: CustomOptions
  ): Promise<{ status: number; payload: Response }> {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: CustomOptions
  ): Promise<{ status: number; payload: Response }> {
    return request<Response>("DELETE", url, options);
  },
};

export default http;
