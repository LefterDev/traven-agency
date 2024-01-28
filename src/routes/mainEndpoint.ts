import { Router, Response, Request } from "express";
import { Boat } from "../Schemas/Boat";
export const Mainendpoint: Router = Router();

Mainendpoint.get("/boats", async (req: Request, res: Response) => {
  const boats = await Boat.find();
  res.send({ boats });
});

Mainendpoint.post("/boats", async (req: Request, res: Response) => {
  try {
    const { name, specifications, equipment } = req.body;
    // const searchIfInDatabase = await Boat.find({ name: name });
    // if (searchIfInDatabase !== null)
    //   return res.status(409).send({
    //     response:
    //       "This boat is already in database. If you wish to update it please use the update endpoint: `/api/boats/update`",
    //     info: `ID of the boat: ${searchIfInDatabase[0].id}`,
    //   });
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
