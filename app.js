const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/stayora";

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);


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

app.use("/listings", listings);




const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};



//REVIEW ROUTE

//ADD NEW REVIEWs
app.post("/listings/:id/review",
    validateReview,
    wrapAsync(async(req, res)=> {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Review Save");
    res.redirect(`/listings/${req.params.id}`);
}));

//DELTE REVIEWS
 app.delete("/listings/:id/reviews/:reviewId", 
    wrapAsync( async(req, res)=>{
        let {id, reviewId} = req.params;
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);

 } ) );


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


// 404 Error Handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


// Global Error Handler
app.use((err, req, res, next) => {
    let { status = 500, message="Something went wrong!" } = err;
    res.render("listings/error.ejs", {message});
    // res.status(status).send(message);
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});