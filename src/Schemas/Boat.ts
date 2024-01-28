import { Schema, model } from "mongoose";

const BoatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  specifications: {
    type: Object,
    required: true,
  },
  equipment: {
    type: Array,
    required: true,
  },
});

export const Boat = model("Boat", BoatSchema, "Boat");
