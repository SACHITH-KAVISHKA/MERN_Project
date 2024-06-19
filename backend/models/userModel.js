const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema =  new mongoose.Schema({

    firstName: {
        type: String,
        trim: true,
        required: [true, "first name is required"],
        maxlength: 32
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "last name is required"],
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: [true, "email is required"],
        unique: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please add a valid email' ]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "first name is required"],
        minlength: [8, 'password must be at least 8 character']
    },
    phoneNo: {
        type: String,
        trim: true,
        required: [true, "phone number is required"],
        match: [ /^[0-9]{10}$/,'Please add a valid Phone Number']
    }

} , { timestamps: true})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
}

module.exports = mongoose.model("User", userSchema);


