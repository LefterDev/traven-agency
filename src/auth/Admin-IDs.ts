import { scryptSync, randomBytes, createCipheriv, createDecipheriv} from "node:crypto";
import { Response } from "express";
import { AdminAccount, AdminPreRegistration } from "../Schemas/Admin";
const adminKey = process.env.ADMIN_KEY;
const generatedKey = scryptSync(adminKey as string, "salt", 24);
const encryption_algorithm = process.env.ENC_ALG;
const initilizationVector = randomBytes(16);

const createAdminKey = async ( username: string, password: string, res: Response ) => {
  try {
    const { response } = await checkAdminAccount(username);
    if (response)
      return res.status(305).send({ error: "Account already registered!" });
    const cipher = createCipheriv(
      encryption_algorithm as string,
      generatedKey,
      initilizationVector
    );
    let encrypted = cipher.update(password, "utf-8", "base64url");
    encrypted += cipher.final("base64url");
    res.status(201).send({
      success:
        "Admin key successfully created, contact IT to access your account by providing your key",
    });
    new AdminPreRegistration({
      username: username,
      genKey: generatedKey,
      iv: initilizationVector,
      encryptedAdminKey: encrypted,
    }).save();
    return encrypted;
  } catch (err) {
    console.error(err);
  }
};

const decryptAdminKey = async ( username: string, res: Response ) => {
  try {
    const {response, genKey, iv, encryptedKey} = await checkAdminAccount(username);
    if (!response)
      return res.status(305).send({ error: "Account already registered or doesn't exists!" });
    const decipher = createDecipheriv(
      encryption_algorithm as string,
      genKey as string,
      iv as Buffer
    );
    let decrypted = decipher.update(encryptedKey as string, "base64url", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch (err) {
    console.error(err);
  }
};

const createAdminAccount = async ( username: string, email: string, res: Response ) => {
  try {
    const { response } = await checkAdminAccount(username)
    if(response) return res.status(305).send({error: "Account already registered!"})
    new AdminAccount({
      username: username,
      password: await decryptAdminKey(username, res),
      email: email,
    }).save();
    AdminPreRegistration.deleteOne({username: username}).then(() => {
      return res.status(200).send({success: "Account successfully created!"})
    }).catch((err) => {
      console.error(err);
      return res.status(201).send({error: err})
    })
  } catch (err) {
    console.error(err);
  }
};

async function checkAdminAccount(username: string) {
  const searchAccount = await AdminPreRegistration.findOne({
    username: username,
  });
  if (searchAccount !== null)
    return {
      response: true,
      genKey: searchAccount.genKey,
      iv: searchAccount.iv,
      encryptedKey: searchAccount.encryptedAdminKey
    };
  return { response: false };
}
export = { createAdminKey, createAdminAccount };
