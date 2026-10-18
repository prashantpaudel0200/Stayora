
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1064&auto=format&fit=crop"
    }
},
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
