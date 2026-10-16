const express = require("express");
const app = express();
const mogooese = require("mongoose");
const path = require("path");
const port = 8080;


app.get("/", (req, res)=>{
    res.send("Hi, I am root");
})

app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`);
})