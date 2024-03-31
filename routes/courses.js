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


router
    .route("/")
    .get(getCourses)

router
    .route("/:bootcampId/courses")
    .post(addCourse)

router
    .route("/:id")
    .get(
        advanceResults(Course, {
            path: 'bootcamp',
            select: 'name description'
        }),
        getCourse
    )
    .put(updateCourse)
    .delete(deleteCourse)


module.exports = router