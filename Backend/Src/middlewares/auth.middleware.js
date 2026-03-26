const blacklistmodel = require("../model/blacklist.model")
const usermodel=require("../model/usermodel")
const redis = require("../config/cache")
const jwt= require("jsonwebtoken")

async function authuser(req,res,next) {
    const token= req.cookies.token

    if(!token){
        return res.status(400).json({
            message: "token not provided"
        })
    }

    const istokenBlacklist= await redis.get(token)

    if(istokenBlacklist){
        return res.status(401).json({
            message:"invalid token"
        })
    }

    try{
       const decoded= jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }

    catch(err){
        return res.status(400).json({
            message: "invalid token"
        })
    }
}

module.exports={
    authuser
}