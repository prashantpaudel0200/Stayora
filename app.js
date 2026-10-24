const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/stayora";

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

//INDEX ROUTE
app.get("/listings", async (req, res) => {
    let allListings = await Listing.find({})
        .catch((err) => {
            console.log("Fail to fetch listing data", err);
        });
    res.render("listings/index.ejs", { allListings });
});

//SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
})

// app.get("/testListing", async (req, res) => {
//         let sampleListing = new Listing({
//             title: "My new villa",
//             description: "By the beach",
//             price: 2500,
//             location: "Lake Side, Pokhara",
//             country: "Nepal",
//         });
//         await sampleListing.save();
//         console.log("Sample was saved");
//         res.send("Successful testing");
// });

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});