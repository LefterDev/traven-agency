import {Router, Request, Response} from "express";
import { createAdminAccount, createAdminKey } from "../auth/Admin-IDs";
export const adminEndpoint: Router = Router();

adminEndpoint.post("/create-preregister", async (req: Request, res: Response) => {
    const {username, password} = req.body;
    return createAdminKey(username, password, res);
})

adminEndpoint.post("/create-account", async (req: Request, res: Response) => {
    const {username, email} = req.body;
    return createAdminAccount(username, email, res);
})