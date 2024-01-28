import { Schema, model } from "mongoose";

const AdminPreRegistrationSchema = new Schema({
  username: {
    type: String,
    required: true,
    default: "admin",
  },
  genKey: {
    type: String,
    required: true,
  },
  iv: {
    type: Buffer,
    required: true,
  },
  encryptedAdminKey: {
    type: String,
    required: true,
  },
});

const AdminAccountSchema = new Schema({
  username: {
    type: String,
    required: true,
    default: "admin"
  },
  password: {
    type: String,
    required: true
  },
  encryptedAdminKey: {
    type: String,
    required: true
  },
  adminEmail: {
    type: String,
    required: true
  }
})

export const AdminPreRegistration = model("AdminsPreRegistration", AdminPreRegistrationSchema,"AdminsPreRegistrations");
export const AdminAccount = model("AdminAccounts", AdminAccountSchema, "AdminAccounts");
