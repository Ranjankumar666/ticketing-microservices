import mongoose from "mongoose";
const port = process.env.PORT || 3000;
import app from "./app";

mongoose
    .connect(process.env.DB_URL!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Starting Up the Auth server");
        app.listen(port, () => {
            console.log("Auth server started at", port);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
