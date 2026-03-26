const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "username is must be unique"]

    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email is must be unique"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        select:false


    }
})

const usermodel = mongoose.model("user", userschema)

module.exports = usermodel