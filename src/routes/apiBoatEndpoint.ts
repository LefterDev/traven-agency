import { Router, Response, Request } from "express";
import { Boat } from "../Schemas/Boat";
export const boatEndpoint: Router = Router();

boatEndpoint.get("/list", async (req: Request, res: Response) => {
  const boats = await Boat.find();
  res.send({ boats });
});

boatEndpoint.post("/insert", async (req: Request, res: Response) => {
  try {
    const { name, specifications, equipment } = req.body;
    let query: Record<string, object> = {
      name: name,
      specifications: specifications,
      equipment: equipment,
    };
    new Boat(query).save().then(() =>
      res.status(201).send({
        response: "Body successfully submitted with following details:",
        info: query,
      })
    );
  } catch (err) {
    console.error(err);
  }
});
