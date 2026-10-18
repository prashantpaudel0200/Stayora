
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMJA3fDA%3D",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMJA3fDA%3D"
                : v,
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
