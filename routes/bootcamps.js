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
const { protect, authorize } = require('../middleware/auth');
const courseRouter = require("./courses");
const advanceResults = require("../middleware/advanceResults");

router.use("/:bootcampId/courses", courseRouter)

router
    .route("/")
    .get(advanceResults(Bootcamp, 'courses'), getAllBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
    .route("/:id")
    .get(getSingleBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router
    .route("/radius/:zipcode/:distance")
    .get(getBootcampsInRadius)
module.exports = router

