import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SlideSessionResType,
} from "@/app/schemaValidations/auth.schema";
import http from "@/lib/http";

const authApiRequest = {
  login: (body: LoginBodyType) => {
    return http.post<LoginResType>("auth/login", body);
  },
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("auth/register", body),
  auth: (body: { sessionToken: string }) =>
    http.post<SlideSessionResType>("api/auth", body, {
      baseUrl: "",
    }),
};

export default authApiRequest;
