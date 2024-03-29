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

router
    .route("/")
    .get(getAllBootcamps)
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

