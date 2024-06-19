const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResposnse');


exports.signup = async (req, res, next) => {
    const {email} = req.body;
    const userExist = await User.findOne({ email });
    if(userExist){
        return next(new ErrorResponse("Email already registred", 400));
    }
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ success: false, message: "Please provide email and password"});
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ success:false, message: "Invalid Credentials"});
        }

        const isMatched = await user.comparePassword(password);
        if(!isMatched) {
            return res.status(400).json({ success: false, message: "Invalid Credentials"});
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    res
        .status(codeStatus)
        .cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        .json({
            success: true,
            name: user.firstName
        })
};

exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "logged out"
    })
};

exports.userProfile = async (req, res, next) => {

    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
        success: true,
        user
    })
};

exports.singleUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        res.status(200).json({
            success: true,
            user
        });
    }catch {
        next(error);
    }
}

exports.editUser = async(req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true});
        if(!user){
            return next(new ErrorResponse('User not found', 404));
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error);
    }
}

exports.deleteUser = async(req, res, next) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id});
        if(!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        res.status(200).json({
            success: true

        })
    } catch (error) {
        next(error);
    }
};