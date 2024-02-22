import {Router, Request, Response} from "express";
import { createAdminAccount, createAdminKey } from "../auth/Admin-IDs";
export const adminEndpoint: Router = Router();

adminEndpoint.post("/create-preregister", async (req: Request, res: Response) => {
    const {username, password} = req.body;
    if(!username || !password) return res.status(305).send({error: "Missing argument(s)"});
    return createAdminKey(username, password, res);
})

adminEndpoint.post("/create-account", async (req: Request, res: Response) => {
    const {username, email} = req.body;
    if(!username || !email) return res.status(305).send({error: "Missing argument(s"})
    return createAdminAccount(username, email, res);
})