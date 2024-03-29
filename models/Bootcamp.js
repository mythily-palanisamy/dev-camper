const mongoose = require("mongoose")
const slugify = require("slugify")
const geocoder = require("../utils/geocoder")


const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxLength: [50, "Name cannot be more than 50 characters"]
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add description"],
        unique: true,
        maxLength: [500, "Description cannot be more than 500 characters"]
    },
    website: {
        type: String,
        // match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "Please add a valid URL"]
    },
    phone: {
        type: String,
        required: [true, "Please add phone"],
        maxLength: [50, "Phone cannot exceed more than 10 characters"]
    },
    email: {
        type: String,
        required: [true, "Please add email"],
    },
    address: {
        type: String,
        required: [true, "Please add address"],
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, "Rating cannot be less than 1"],
        max: [1, "Rating cannot exceed more than 10"]
    },
    averageCost: String,
    photo: {
        type: String,
        default: "no-photo.jpg"
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// create bootcamp slug from name
// when u save in db, and then u want to edit it into a url-friendly is called as slugify

//pre: it is a middleware that runs before the documents is saved
//next: it is a function that runs after the middleware is done

BootcampSchema.pre("save", function (next) {
    // console.log("in slugify")
    this.slug = slugify(this.name, { lower: true })
    next()
})

//geocode and create location field
BootcampSchema.pre("save", async function (next) {
    // console.log("in location save")
    const loc = await geocoder.geocode(this.address)
    //why we use geocoder ,why we need to convert the address into the coordinates- because we need to show the location of the bootcamp on the map

    this.location = {
        type: "Point",
        //longitude - xaxis, latitude - yaxis of the map
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
    next();
    this.address = undefined //we dont need address because we have formattedAddress instead
})
module.exports = mongoose.model("Bootcamp", BootcampSchema)

//i am getting an error ;     "error": "Status is REQUEST_DENIED. You must use an API key to authenticate each request to Google Maps Platform APIs. For additional information, please refer to http://g.co/dev/maps-no-account"
//i have added the api key in the .env file but still i am getting this error-