import { connect } from "mongoose";

(async () => {
  connect(process.env.MONGO_URI as string || "mongodb://localhost:27017")
    .then(() => {
      console.log("Database connected successfully!");
    })
    .catch((err) => {
      console.error(err);
    });
})();
