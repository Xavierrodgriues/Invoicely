const express = require("express");
const router = express.Router();
const {registeration, login, logout} = require("../controllers/user.controller");
const { authMiddleware, authorizeRoles } = require("../middleware/auth.middleware");

router.post("/register", registeration);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/verify", authMiddleware, (req, res) => {
    return res.status(200).json({authenticated: true, user: req.user});
});




// testing apis for role
router.get("/profile", authMiddleware, (req, res) => {


    res.send(req.user);
});

router.get("/admin", authMiddleware, authorizeRoles("Admin"), (req, res) => {
    res.send({
        message: "Welcome admin! you have special access"
    })
});

router.get("/client", authMiddleware, authorizeRoles("Client"), (req, res) => {
    res.send({
        message: "Welcome client!"
    })
});

module.exports = router;