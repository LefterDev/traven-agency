import { scryptSync, randomBytes, createCipheriv, createDecipheriv} from "node:crypto";
import { Response } from "express";
import { AdminAccount, AdminPreRegistration } from "../Schemas/Admin";
const adminKey = process.env.ADMIN_KEY || "admin";
const generatedKey = scryptSync(adminKey as string, "salt", 24);
const encryption_algorithm = process.env.ENC_ALG || "aes-192-ecb";
const initilizationVector = Buffer.alloc(16, 0);

export const createAdminKey = async ( username: string, password: string, res: Response ) => {
  try {
    //* Check if there is already a pre-registration admin account on this username
    const { response } = await checkAdminAccount(username);
    //* Return 305 if there is
    if (response)
      return res.status(305).send({ error: "Account already registered!" });
    //* Create cipher key for encryption
    const cipher = createCipheriv(
      encryption_algorithm as string,
      generatedKey,
      initilizationVector
    );
    //* Initiate encryption key with the desired password assigned to it
    let encrypted = cipher.update(password, "utf-8", "base64url");
    encrypted += cipher.final("base64url");
    //* Return the encryption key for admin account creation
    res.status(201).send({
      success:
        "Admin key successfully created, contact IT to access your account by providing your key",
    });
    //* Save the account into database
    new AdminPreRegistration({
      username: username,
      genKey: generatedKey,
      iv: initilizationVector,
      encryptedAdminKey: encrypted,
    }).save();
    return encrypted;
  //! Throw error if any
  } catch (err) {
    console.error(err);
  }
};

const decryptAdminKey = async ( username: string, res: Response ) => {
  //* Check if there is an admin pre-registration account on this username
  try {
    const {response, genKey, iv, encryptedKey} = await checkAdminAccount(username);
    //* If there isn't return 305
    if (!response)
      return res.status(305).send({ error: "Account already registered or doesn't exists!" });
    //* Create decipher key for decryption
    const decipher = createDecipheriv(
      encryption_algorithm as string,
      genKey as string,
      iv as Buffer
    );
    //* Initiate decryption key
    let decrypted = decipher.update(encryptedKey as string, "base64url", "utf-8");
    decrypted += decipher.final("utf-8");
    //* Return the password encrypted
    return decrypted;
  //! Throw error if any
  } catch (err) {
    console.error(err);
  }
};

export const createAdminAccount = async ( username: string, email: string, res: Response ) => {
  try {
    //* Check if there is an pre-registration admin account on this username
    const { response } = await checkAdminAccount(username)
    // If there is return 305
    if(response) return res.status(305).send({error: "Account already registered!"})
    //* Save the new admin account into database
    new AdminAccount({
      username: username,
      password: await decryptAdminKey(username, res),
      email: email,
    }).save();
    //* Delete all encryptions and preregistered data
    AdminPreRegistration.deleteOne({username: username}).then(() => {
      return res.status(200).send({success: "Account successfully created!"})
    //! Throw error if any
    }).catch((err) => {
      console.error(err);
      return res.status(201).send({error: err})
    })
  //! Throw error if any
  } catch (err) {
    console.error(err);
  }
};

async function checkAdminAccount(username: string) {
  //* Check if the is any Pre-registration account
  const searchAccount = await AdminPreRegistration.findOne({
    username: username,
  });
  //* if there is return true and its credentials
  if (searchAccount !== null)
    return {
      response: true,
      genKey: searchAccount.genKey,
      iv: searchAccount.iv,
      encryptedKey: searchAccount.encryptedAdminKey
    };
  //* Else return false
  return { response: false };
}
