const usermodel = require("../model/usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const blacklistmodel = require("../model/blacklist.model")
const redis = require("../config/cache")


async function register(req, res) {
    const { username, email, password } = req.body
    const isAlreadyregister = await usermodel.findOne({
        $or: [{ email }, { username }]
    })

    if (isAlreadyregister) {
        return res.status(400).json({
            message: "username with same email or username already exist"
        })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await usermodel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)
    res.status(201).json({
        message: "user register successfully", user
    })

}

async function loginuser(req, res) {
    try {
        const { email, password } = req.body;

        console.log("LOGIN BODY:", req.body); // 🔥 debug

        // ✅ find user ONLY by email
        const user = await usermodel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ compare password
        const ispasswordvalid = await bcrypt.compare(password, user.password);

        if (!ispasswordvalid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        // ✅ generate token
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // ✅ cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax"
        });

        // ✅ response (IMPORTANT)
        res.status(200).json({
            success: true,
            message: "user login successfully",
            user
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function getme(req, res) {

    const user = await usermodel.findById(req.user.id)
    res.status(200).json({
        message: "User fetched successfully",
        user
    })
}


async function logout(req, res) {
    const token = req.cookies.token


    if (!token) { 
        return res.status(400).json({ message: "No token found in cookies" });
    }

    res.clearCookie("token")

    await redis.set(token, Date.now().toString(), "EX", 60 * 60)

  

    res.status(200).json({
        message: "logout successfully"
    })

}





module.exports = {
    register,
    loginuser,
    getme,
    logout
}