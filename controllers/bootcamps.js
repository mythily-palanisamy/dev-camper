
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getAllBootcamps = asyncHandler(
    async (req, res, next) => {

        let allBootcamps = await Bootcamp.find()
        res.status(200).json({
            success: true,
            mesge: "showing all bootcamps",
            data: allBootcamps

        })
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

        let deletedBootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if (!deletedBootcamp) {
            return next(new ErrorResponse(`Bootcamp not found in Id of ${req.params.id}`, 404))
        }
        res.status(200).send({
            success: true,
            msg: `deleted ${req.params.id}`
        })
    }
) 