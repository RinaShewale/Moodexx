const{Router}= require("express")
const authcontroller= require("../controllers/auth.controller")
const { authuser } =require("../middlewares/auth.middleware")

const router=Router()



router.post("/register",authcontroller.register)
router.post("/login",authcontroller.loginuser)

router.get("/get-me",authuser,authcontroller.getme)

router.get("/logout",authcontroller.logout)

module.exports= router