const mongoose = require("mongoose")
const slugify = require("slugify")

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
BootcampSchema.pre("save", function (next) {
    // console.log("slugify ran", this.name)
    this.slug = slugify(this.name, { lower: true })
    next()
})

module.exports = mongoose.model("Bootcamp", BootcampSchema)