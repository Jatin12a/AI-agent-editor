import mongoose from "mongoose";




function connect() {
   mongoose.connect(process.env.MONGO_URL)
   .then(() => {
      console.log("DB connected");
   })
    .catch((err) => {
        console.log(err);
    });
}

export default connect;