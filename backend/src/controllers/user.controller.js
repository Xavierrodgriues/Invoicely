const bcrypt = require("bcrypt");
const userModel = require("../models/users.model");
const jwt = require("jsonwebtoken");

// Registration
const registeration = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            role: role || "Client"
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3. Sign JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1h" }
        );

        // 4. Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Logout
const logout = async (req, res) => {
    try{

        res.clearCookie("token");

        return res.status(200).json({message: "Logout successfull"});

    }catch(err){
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = { registeration, login, logout };