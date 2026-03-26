const mongoose = require("mongoose")


const Blacklistschema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required for blacklisting"]
    }
}, {
    timestamps: true
})


const blacklistmodel= mongoose.model("blacklist",Blacklistschema)


module.exports=blacklistmodel