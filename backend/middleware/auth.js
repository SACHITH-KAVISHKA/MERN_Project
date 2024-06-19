const ErrorResponse = require("../utils/errorResposnse");
const jwt = require('jsonwebtoken')
const User = require("../models/userModel");

exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    if(!token) {
        return next(new ErrorResponse('You must log in!', 401));
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decode.id);
        next();
    }catch(error){
        return next(new ErrorResponse('You must log in!', 401))
    }
}

exports.isAdmin = (req, res, next) => {
    if(req.user.role === 0){
        return next(new ErrorResponse('Access denied, you must an admin', 401))
    }
    next();
}