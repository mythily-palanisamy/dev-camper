
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const geocoder = require("../utils/geocoder")

const Course = require('../models/Course');


//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
}
)

//@desc get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access public
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {

    let singleBootcamp = await Bootcamp.findById(req.params.id)
    if (!singleBootcamp) {
        return next(new ErrorResponse(`Bootcamp not found in Id of ${req.params.id}`, 404))
    }
    res.status(200).send({
        success: true,
        msg: `single bootcamp fetched ${req.params.id}`,
        data: singleBootcamp,
    })
})

//@desc Create bootcamp
//@route POST /api/v1/bootcamps
//@access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    console.log("body:", req.body)
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp,
    });
})

//@desc update bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access private
exports.updateBootcamp = asyncHandler(
    async (req, res, next) => {

        const updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!updatedBootcamp) {
            return next(new ErrorResponse(`Bootcamp not found in Id of ${req.params.id}`, 404))
        }
        res.status(200).json({
            success: true,
            msg: "Bootstrap updated",
            data: updatedBootcamp
        })
    }
)


//@desc delete bootcamp
//@route GET /api/v1/bootcamps/:id
//@access private
exports.deleteBootcamp = asyncHandler(
    async (req, res, next) => {

        let bootcamp = await Bootcamp.findById(req.params.id)
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found in Id of ${req.params.id}`, 404))
        }
        bootcamp.remove()

        res.status(200).send({
            success: true,
            msg: `deleted ${req.params.id}`
        })
    }
)

// get bootcamps within a radius
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Divide distance by radius of Earth
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

