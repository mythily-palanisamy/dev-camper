const mongoose = require("mongoose")

//connecting to mongodb using mongoose library
let connectDB = async () => {
    // let connect = await mongoose.connect(process.env.MONGO_URI)
    // console.log(`MONGO_URI: ${process.env.MONGO_URI}`);
    try {
        let connect = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${connect.connection.host}`.cyan);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`.red);
        // Throw the error to catch it in the main application file
        throw error;
    }

}
module.exports = connectDB