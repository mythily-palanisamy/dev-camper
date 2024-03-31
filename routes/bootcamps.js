const express = require("express")
const router = express.Router()
const {
    getAllBootcamps,
    getSingleBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
} = require("../controllers/bootcamps")

const Bootcamp = require('../models/Bootcamp');

const courseRouter = require("./courses");
const advanceResults = require("../middleware/advanceResults");

router.use("/:bootcampId/courses", courseRouter)

router
    .route("/")
    .get(advanceResults(Bootcamp, 'courses'), getAllBootcamps)
    .post(createBootcamp)

router
    .route("/:id")
    .get(getSingleBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)

router
    .route("/radius/:zipcode/:distance")
    .get(getBootcampsInRadius)
module.exports = router

