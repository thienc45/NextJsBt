// import { LoginResType } from "@/app/schemaValidations/auth.schema";
// import { normalizePath } from "./utils";

// type CustomOptions = Omit<RequestInit, "method"> & {
//   baseUrl?: string | undefined;
// };

// const ENTITY_ERROR_STATUS = 422;

// type EntityErrorPayload = {
//   message: string;
//   errors: {
//     field: string;
//     message: string;
//   }[];
// };

// export class HttpError extends Error {
//   status: number;
//   payload: {
//     [key: string]: any;
//   };
//   constructor(status: number, payload: any) {
//     super("HTTP Error");
//     this.status = status;
//     this.payload = payload;
//   }
// }

// const request = async <Response>(
//   method: "GET" | "POST" | "PUT" | "DELETE",
//   url: string,
//   options?: CustomOptions
// ): Promise<{ status: number; payload: Response }> => {
//   const body = options?.body ? JSON.stringify(options.body) : undefined;
//   const baseHeader = {
//     "Content-Type": "application/json",
//     Authorization: clientSessionToken.value
//       ? `Bearer ${clientSessionToken.value}`
//       : "",
//   };

//   const baseUrl =
//     options?.baseUrl === undefined
//       ? process.env.NEXT_PUBLIC_API_ENDPOINT
//       : options.baseUrl;

//   const fullURL = url.startsWith("/")
//     ? `${baseUrl}${url}`
//     : `${baseUrl}/${url}`;

//   const response = await fetch(fullURL, {
//     ...options,
//     headers: {
//       ...baseHeader,
//       ...options?.headers,
//     } as any,
//     body,
//     method,
//   });

//   const payload :Response = await response.json();

//   const data = {
//     status: response.status,
//     payload,
//   };

//   if (!response.ok) {
//     if (response.status === ENTITY_ERROR_STATUS) {
//       throw new EntityError(
//         data as {
//           status: 422;
//           payload: EntityErrorPayload;
//         }
//       );
//     }
//   }

// //Đảm bảo logic dưới đây chỉ chạy ở phái client  ()
//   if(typeof window !== "undefined"){
//     if (["/auth/login", "/auth/register"].some(item => item === normalizePath(url))) {
//       clientSessionToken.value = (payload as LoginResType).data.token;
//     }else if ('/auth/logout'===  normalizePath(url)) {
//       clientSessionToken.value = '';
//     }
//     return data;
//   }
// };

// export class EntityError extends HttpError {
//   status: 422;
//   payload: EntityErrorPayload;

//   constructor({
//     status,
//     payload,
//   }: {
//     status: 422;
//     payload: EntityErrorPayload;
//   }) {
//     super({ status, payload });

//     if (status !== 422) {
//       throw new Error("EntityError must have status 422");
//     }

//     this.status = status;
//     this.payload = payload;
//   }
// }

class SessionToken {
  private token = "";
  private _expiresAt = new Date().toISOString();

  get value() {
    return this.token;
  }

  set value(token: string) {
    if (typeof window === "undefined") {
      console.error("Cannot set token on server side");
      return; // Tránh việc ném lỗi gây gián đoạn ứng dụng
    }
    this.token = token;
  }

  get expiresAt() {
    return this._expiresAt;
  }

  set expiresAt(expiresAt: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this._expiresAt = expiresAt;
  }
}

// class SessionToken {
//   private token = "";
//   private _expiresAt = new Date().toISOString();

//   get value() {
//     return this.token;
//   }

//   set value(token: string) {
//     // Nếu gọi method này ở server thì sẽ bị lỗi
//     if (typeof window === "undefined") {
//       throw new Error("Cannot set token on server side");
//     }

//     this.token = token;
//   }

//   get expiresAt() {
//     return this._expiresAt;
//   }

//   set expiresAt(expiresAt: string) {
//     // Nếu gọi method này ở server thì sẽ bị lỗi
//     if (typeof window === "undefined") {
//       throw new Error("Cannot set token on server side");
//     }

//     this._expiresAt = expiresAt;
//   }
// }

export const clientSessionToken = new SessionToken();

// const http = {
//   get<Response>(
//     url: string,
//     options?: Omit<CustomOptions, "body">
//   ): Promise<{ status: number; payload: Response }> {
//     return request<Response>("GET", url, options);
//   },
//   post<Response>(
//     url: string,
//     body: any,
//     options?: CustomOptions
//   ): Promise<{ status: number; payload: Response }> {
//     return request<Response>("POST", url, { ...options, body });
//   },
//   put<Response>(
//     url: string,
//     body: any,
//     options?: CustomOptions
//   ): Promise<{ status: number; payload: Response }> {
//     return request<Response>("PUT", url, { ...options, body });
//   },
//   delete<Response>(
//     url: string,
//     options?: CustomOptions
//   ): Promise<{ status: number; payload: Response }> {
//     return request<Response>("DELETE", url, options);
//   },
// };

// export default http;

import { LoginResType } from "@/app/schemaValidations/auth.schema";
import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";

import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;
export const isClient = () => typeof window !== "undefined";
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient()) {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      baseHeaders.Authorization = `Bearer ${sessionToken}`;
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  console.log(data);
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient()) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            } as any,
          });
          try {
            await clientLogoutRequest;
            clientSessionToken.expiresAt = new Date().toISOString();
            clientLogoutRequest = null;
            location.href = "/login";
          } catch (error) {
          } finally {
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("sessionTokenExpiresAt");
            clientLogoutRequest = null;
          }
        }
      } else {
        const sessionToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  if (isClient()) {
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      const { token, expiresAt } = (payload as LoginResType).data;
      localStorage.setItem("sessionToken", token);
      localStorage.setItem("sessionTokenExpiresAt", expiresAt);
    } else if ("auth/logout" === normalizePath(url)) {
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("sessionTokenExpiresAt");
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
