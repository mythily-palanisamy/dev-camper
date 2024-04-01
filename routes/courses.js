const express = require("express")
const Course = require("../models/Course")
const router = express.Router({ mergeParams: true })//mergeParams is used to merge the params from other routers
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse

} = require("../controllers/courses")
const advanceResults = require("../middleware/advanceResults")
const { protect } = require('../middleware/auth');

router
    .route("/")
    .get(getCourses)

router
    .route("/:bootcampId/courses")
    .post(protect, addCourse)

router
    .route("/:id")
    .get(
        advanceResults(Course, {
            path: 'bootcamp',
            select: 'name description'
        }),
        getCourse
    )
    .put(protect, updateCourse)
    .delete(protect, deleteCourse)


module.exports = router