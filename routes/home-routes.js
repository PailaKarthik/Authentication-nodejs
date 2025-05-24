
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware')

router.get("/welcome",authMiddleware,(req,res) => {
    const {username,userId,role} = req.userInfo;
    res.json({
        message : "welcome to home page",
        user : {
            _id : userId,
            username,
            role
        }
    })
});

module.exports = router;

