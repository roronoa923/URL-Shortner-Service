import jwt from "jsonwebtoken";
import { userTokenSchema } from "../validation/token.validation.js";
// const JWT_SECRET = process.env.JWT_SECRET
export async function createUserToken(payload) {
  const validationResult = await userTokenSchema.safeParseAsync(payload);
  if (validationResult.error) throw new Error(validationResult.error.message);
  const payloadValidatedData = validationResult.data;
  const token = jwt.sign(payloadValidatedData, process.env.JWT_SECRET);
  return token;
}

export function validateToken(token){
    try{
      const payload =  jwt.verify(token, process.env.JWT_SECRET)
      return payload
    }catch(error){
      return null
    }
}
