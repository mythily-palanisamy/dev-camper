
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const geocoder = require("../utils/geocoder")
//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getAllBootcamps = asyncHandler(
    // async (req, res, next) => {

    //     let allBootcamps = await Bootcamp.find()
    //     res.status(200).json({
    //         success: true,
    //         mesge: "showing all bootcamps",
    //         data: allBootcamps

    //     })
    // }

    // async (req, res, next) => {
    //     console.log('query:', req.query)
    //     let allBootcamps = await Bootcamp.find(req.query)
    //     res.status(200).json({
    //         success: true,
    //         mesge: "showing all bootcamps",
    //         data: allBootcamps

    //     })
    // }

    async (req, res, next) => {
        let query;
        //copy req.query
        const reqQuery = { ...req.query }

        //fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit']

        //loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param])

        console.log(req.query)
        //create query string
        let queryStr = JSON.stringify(reqQuery)

        //create operators ($gt, $gte, $lt, $lte, $in)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)//replace the query string with $gt, $gte, $lt, $lte, $in 
        query = Bootcamp.find(JSON.parse(queryStr))

        //for selecting
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ')
            query = query.select(fields)
        }

        //for sorting
        if (req.query.sort) {
            const sortBy = req.query.select.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')

        }

        //pagination 

        //if page is not provided default page is 1

        const page = parseInt(req.query.page, 10) || 1  //convert the string (page) to integer (10
        const limit = parseInt(req.query.limit, 10) || 1
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const total = await Bootcamp.countDocuments()

        query = query.skip(startIndex).limit(limit)//skip and limit the number of pages

        const bootcamps = await query
        //pagination result
        const pagination = {}

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }


        // res.status(200).json({
        //     success: true,
        //     count: bootcamps.length,
        //     data: bootcamps
        // })
        res.status(200).send({
            success: true,
            count: bootcamps.length,
            pagination,
            data: bootcamps
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

