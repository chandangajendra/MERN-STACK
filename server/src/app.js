require('dotenv').config()
const express = require('express');
const app = express();
require("./db/conn")
const port = process.env.PORT || 8000;

// our middilewares 
app.use(express.json());
app.use(require('./routes/router'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// listening to the port
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})