
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const adminMiddleware = require('../middlewares/admin-middleware')

router.get("/welcome",authMiddleware,adminMiddleware,(req,res) => {
    res.json({
        message : "welcome to home page"
    })
});

module.exports = router;