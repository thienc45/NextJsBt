import {
  AccountResType,
  UpdateMeBodyType,
} from "@/app/schemaValidations/auth.schema";
import http from "@/lib/http";

const accountApiRequest = {
  me: (sessionToken: string) =>
    http.get<AccountResType>("account/me", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  meClient: () => http.get<AccountResType>("account/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("account/me", body),
};

export default accountApiRequest;
