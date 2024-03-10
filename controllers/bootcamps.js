
const Bootcamp = require("../models/Bootcamp")

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getAllBootcamps = async (req, res, next) => {
    try {
        let allBootcamps = await Bootcamp.find()
        res.status(200).json({
            success: true,
            mesge: "showing all bootcamps",
            data: allBootcamps

        })
    } catch (error) {
        res.status(500).json({
            success: false,
        })
    }
}


//@desc get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access public
exports.getSingleBootcamp = async (req, res, next) => {
    try {

        let singleBootcamp = await Bootcamp.findById(req.params.id)

        if (!singleBootcamp) {
            return res.status(400).json({
                success: false,
                error: "Bootcamp not found"
            })
        }

        res.status(200).send({
            success: true,
            msg: `single bootcamp fetched ${req.params.id}`,
            data: singleBootcamp,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Internal server error"
        })
    }

}


//@desc Create bootcamp
//@route POST /api/v1/bootcamps
//@access private
exports.createBootcamp = async (req, res, next) => {
    try {
        console.log("body:", req.body)
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
};


//@desc update bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!updatedBootcamp) {
            return res.status(400).json({
                success: false,
                error: "Bootcamp not found"
            })
        }
        res.status(200).json({
            success: true,
            msg: "Bootstrap updated",
            data: updatedBootcamp
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: "Cannot update internal server error"
        })
    }

}


//@desc delete bootcamp
//@route GET /api/v1/bootcamps/:id
//@access private
exports.deleteBootcamp = async (req, res, next) => {

    try {
        let deletedBootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if (!deletedBootcamp) {
            return res.status(400).json({
                success: false,
                error: "Cannot find the bootcamp"
            })
        }
        res.status(200).send({
            success: true,
            msg: `deleted ${req.params.id}`
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Cannot delete bootcamp"
        })
    }


}