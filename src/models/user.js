const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema(
    {
    firstName: {
        type: String,
        required: true,
        minlength: '4',
        maxlength: '50'
    }, 
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address :" + value)
            }
        }   
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter A Strong Password!")
            }
        } 
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values : ["male", "female", "other"],
            message: `{VALUE} is not valid gender type`
        }
        // validate(value){
        //     if(!["male", "female", "others"].includes(value)){
        //         throw new Error("Gender Data is Not Valid!");
                
        //     }
        // }

    },
    photoUrl: {
        type: String,
        default: "https://www.mjunction.in/wp-content/uploads/2020/09/Dummy.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL Address :" + value)
            }
        } 
    },
    about: {
        type: String,
        default: "this is a default about the user !!"
    },
    skills: {
        type: [String]
    }
},
{
    timestamps: true,
} 
)

// compound indexing of first & last name
userSchema.index({firstName: 1, lastName: 2})

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id}, "Dev@Tinder&789", {expiresIn: '1d',})
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)
    return isPasswordValid
}


const User = mongoose.model('User', userSchema);

module.exports = User;

 