import jwt from "jsonwebtoken";
import type { JwtUserPayload } from "../modules/auth/auth.types";
import type { StringValue } from "ms";

export const signToken = (
  jwtPayload: JwtUserPayload,
  secret: string,
  expiry: StringValue,
) => {
  const token = jwt.sign(jwtPayload, secret, { expiresIn: expiry });
  return token;
};
