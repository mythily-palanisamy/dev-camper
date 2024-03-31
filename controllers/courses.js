const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        //checking whether the bootcamp exists or not
        //if exists then show the courses of that bootcamp
        query = await Course.find({ bootcamp: req.params.bootcampId });

    } else {
        //if bootcamp does not exists then show all the courses
        query = await Course.find().populate({
            path: 'bootcamp',
            select: 'name description'//only show name and description of the bootcamp
        })
    }
    const courses = await query;
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});


// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(
            new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: course
    });
});


// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    console.log(req.params, req.user)
    req.body.bootcamp = req.params.bootcampId; //why we need bootcamp id --> because we need to know that which course belongs to which bootcamp
    // req.body.user = req.user.id; //why we need user id --> because we need to know that which user added the course 

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `No bootcamp with the id of ${req.params.bootcampId}`,
                404
            )
        );
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc      update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);//finding the course by id

    if (!course) {
        return next(
            new ErrorResponse(
                `No course with the id of ${req.params.id}`,
                404
            )
        );
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: course
    });
});


// @desc     delete course
// @route     DELETE/api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);//finding the course by id

    if (!course) {
        return next(
            new ErrorResponse(
                `No course with the id of ${req.params.id}`,
                404
            )
        );
    }
    course = await Course.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        data: course
    });
});

