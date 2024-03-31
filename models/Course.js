const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

// Static method to get avg of course tuitions
//what is statics- a method that is called on the model itself
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([//aggregate is used to get the average cost of the courses

        {
            $match: { bootcamp: bootcampId }//match is used to match the bootcamp id with the bootcamp id of the course
        },
        {
            $group: {//group is used to group the courses
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);
    console.log(obj)
    const averageCost = obj[0]
        ? Math.ceil(obj[0].averageCost / 10) * 10//ceil - round off the cost
        : undefined;//if there is no course then average cost will be undefined
    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageCost,
        });
    } catch (err) {
        console.log(err);
    }
};

// Call getAverageCost after save
CourseSchema.post('save', async function () {
    await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after remove
CourseSchema.post('remove', async function () {
    await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after tuition update
CourseSchema.post("findOneAndUpdate", async function (doc) {
    if (this.tuition != doc.tuition) {
        await doc.constructor.getAverageCost(doc.bootcamp);
    }
});

module.exports = mongoose.model('Course', CourseSchema);
