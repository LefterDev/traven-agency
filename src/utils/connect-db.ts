import { connect } from "mongoose";

(async () => {
  connect(process.env.MONGO_URI as string)
    .then(() => {
      console.log("Database connected successfully!");
    })
    .catch((err) => {
      console.error(err);
    });
})();
