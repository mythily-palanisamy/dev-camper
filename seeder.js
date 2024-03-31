const fs = require("fs"); //fs helps in reading and writing files
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv")

// load env variables
dotenv.config({ path: "./config/config.env" })

//load the modal 
const Bootcamp = require("./models/Bootcamp")
const Course = require("./models/Course")


// connect to db
mongoose.connect(process.env.MONGO_URI)

// Read JSON files
const bootcamps = JSON.parse(
    //converting bootcamp.json to a string
    //dirname- it gives the current directory name
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')

);
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);


// Import into DB
const importData = async () => {
    try {
        console.log("in")
        await Bootcamp.create(bootcamps);
        // await Course.create(courses);
        console.log('Data Imported...', colors.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete data
const deleteData = async () => {
    try {
        console.log("delt")
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data Destroyed...', colors.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};
//  if we run( node seeder.js -i) then importData() will run 
// if we run (node seeder.js -d )then deleteData() will run
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}
