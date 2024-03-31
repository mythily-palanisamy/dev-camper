const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")
const errorHandler = require("./middleware/error")
//route files
const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")
const auth = require("./routes/auth")
// middleware import
const morgan = require("morgan")
// db connection import
const connectDB = require("./config/db")

dotenv.config({ path: "./config/config.env" })
connectDB()
const app = express()

//body parser 
//middleware for handling post req
app.use(express.json())

//used morgan middleware for logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}


app.use("/api/v1/bootcamps", bootcamps)
app.use("/api/v1/courses", courses)
app.use("/api/v1/auth", auth)

// its a middleware to catch and handle any errors that occur during the processing of requests.
app.use(errorHandler)

const PORT = process.env.PORT || 2001

app.listen(PORT, () => {
    console.log(`server is running in ${process.env.NODE_ENV} in ${PORT}`.yellow)
})
