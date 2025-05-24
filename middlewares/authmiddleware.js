
const jwt = require('jsonwebtoken')
const authMiddleware = (req,res,next) => {
    const authHeaders = req.headers['authorization'];
    console.log(authHeaders);
    
    const token = authHeaders && authHeaders.split(" ")[1];
    if(!token){
        res.json({
            success : false,
            message : "token not found ! please login to continue."
        })
    }
    
    try{
        const decodedTokenInfo = jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(decodedTokenInfo);

        req.userInfo = decodedTokenInfo;
        next();
    }catch(e){
        res.json({
            success : false,
            message : "token not found ! please login to continue."
        })
    }
}

module.exports = authMiddleware;