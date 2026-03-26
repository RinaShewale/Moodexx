const usermodel = require("../model/usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const redis = require("../config/cache")

// REGISTER
async function register(req, res) {
    try {
        const { username, email, password } = req.body

        const isAlreadyregister = await usermodel.findOne({
            $or: [{ email }, { username }]
        })

        if (isAlreadyregister) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hash = await bcrypt.hash(password, 10)
        const user = await usermodel.create({ username, email, password: hash })

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "3d" })

        // ✅ Proper cookie for cross-origin
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,        // 🔥 must be true for production HTTPS
            sameSite: "None"     // 🔥 important for frontend hosted on different origin
        })

        // ✅ Fixed response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
            token
        })

    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// LOGIN
async function loginuser(req, res) {
    try {
        const { email, password } = req.body
        const user = await usermodel.findOne({ email }).select("+password")

        if (!user) return res.status(400).json({ success: false, message: "User not found" })

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return res.status(400).json({ success: false, message: "Invalid password" })

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "3d" })

        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" })

        res.status(200).json({ success: true, message: "Login successful", user, token })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// GET ME
async function getme(req, res) {
    try {
        const user = await usermodel.findById(req.user.id)
        if (!user) return res.status(404).json({ success: false, message: "User not found" })

        res.status(200).json({ success: true, message: "User fetched successfully", user })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

// LOGOUT
async function logout(req, res) {
    try {
        const token = req.cookies.token
        if (!token) return res.status(400).json({ success: false, message: "No token found" })

        res.clearCookie("token")
        await redis.set(token, Date.now().toString(), "EX", 60 * 60)

        res.status(200).json({ success: true, message: "Logout successful" })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = { register, loginuser, getme, logout }