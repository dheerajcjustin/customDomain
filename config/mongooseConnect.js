import mongoose from "mongoose";
// mongoose.set("strictQuery", false);

const mongooseConnect = async () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("mongoose conceded successful");
    })
    .catch((err) => {
      console.log(err);
      console.log("mongoose connection failed");
    });
};

export default mongooseConnect;
