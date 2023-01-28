require('dotenv').config()
const mongoose = require("mongoose");
//URL=mongodb+srv://devendrakumar:hZrD0dXPjNDOLkYi@mearncluster.mlh3a0g.mongodb.net/?retryWrites=true&w=majority

mongoose.connect(process.env.URL)
    .then(() => {
        console.log("Sucess ! Coneected to mongo db");
    })
    .catch((e) => {
        console.log("Failed ! Not connected to mongo db" + e);
    })

