import {
  scryptSync,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from "node:crypto";
import { NextFunction, Request, Response } from "express";
import { AdminPreRegistration } from "../Schemas/Admin";
import { checkAdminHeader } from "../utils/authorizationMiddleware";
const adminKey = process.env.ADMIN_KEY;
const generatedKey = scryptSync(adminKey as string, "salt", 24);
const encryption_algorithm = "aes-192-cbc";
const initilizationVector = randomBytes(16);

const createAdminKey = async ( username: string, password: string, res: Response) => {
  const searchIfAdminExists = await AdminPreRegistration.findOne({username: username});
  if(searchIfAdminExists) return res.status(305).send({error: "Username already registered in database"});
  const cipher = createCipheriv( encryption_algorithm, generatedKey, initilizationVector );
  let encrypted = cipher.update(password, "utf-8", "base64url");
  encrypted += cipher.final("base64url");
  res.status(201).send({Success: "Admin key successfully created, contact IT to access your account by providing your key", });
  new AdminPreRegistration({
    username: username,
    genKey: generatedKey,
    iv: initilizationVector,
    encryptedAdminKey: encrypted,
  }).save();
  return encrypted;
};

const decryptAdminKey = async ( username: string, encryptedKey: string, res: Response) => {
  try {
    const searchIfExists = await AdminPreRegistration.findOne({
      username: username,
    });
    if (!searchIfExists || searchIfExists === null) return res.status(404).send({ error: "Username not found in admin database" });
    const decipher = createDecipheriv(encryption_algorithm, searchIfExists.genKey, searchIfExists.iv);
    let decrypted = decipher.update(encryptedKey, "base64url", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch (err) {
    console.error(err);
  }
};

const createAdminAccount = async (username: string, email: string, res: Response) => {
  try {
    
  } catch(err) {
    console.error(err);
  }
}
export = { createAdminKey };
