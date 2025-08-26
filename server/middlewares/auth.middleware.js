import jwt from "jsonwebtoken"

export const userAuth = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return res.status(500).json({success:false, message: "Not authorized" })
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.SECRET_KEY);
        if(tokenDecode.userId){
            req.body.loginId = tokenDecode.userId;
        }else{
            return res.status(500).json({success:false, message: "Not authorized" });
        }
        next()
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}