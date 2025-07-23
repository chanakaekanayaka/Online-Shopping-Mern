import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {

        courseName : String,
        courseID : Number,
        courseDuration : Number,
        coursefee : String,

    }
)

const Course = mongoose.model("courses",courseSchema)

export default Course;