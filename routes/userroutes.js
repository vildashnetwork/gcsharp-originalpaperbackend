import User from "../models/Users.js";

import express from "express"


const router = express.Router();


router.post("/register", async (req, res) => {
    try {
        const { name, email, username, password } = req.body;



        const findme = User.findOne({ username: username });


        const newUser = new User({
            name,
            email,
            username,
            password
        });

        const savedUser = await newUser.save();

        if (savedUser) {
            res.status(201).json({ message: "User registered successfully" });
        } else {
            res.status(400).json({ message: "Failed to register user" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username, password: password });

        if (user) {
            res.status(200).json({
                message: "Login successful",
                data: user
            });
        }
        else {
            res.status(401).json({ message: "Invalid username or password" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/getuser/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: username });

        if (user) {
            res.status(200).json({
                message: "User found",
                data: user
            });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


router.delete("/deleteuser/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const deletedUser = await User.findOneAndDelete({ username: username });
        if (deletedUser) {
            res.status(200).json({ message: "User deleted successfully" });

        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
    }
});

router.put("/updateuser/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const updatedUser = await User.findOneAndUpdate({ username: username }, req.body);
        if (updatedUser) {
            res.status(201).json({
                message: "user updated successfully",
                updatedUser
            })
        } else {
            res.status(404).json({
                message: "user not found"
            })
        }

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})



export default router;