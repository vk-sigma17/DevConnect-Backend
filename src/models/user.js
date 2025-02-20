const mongoose = require('mongoose');
var validator = require('validator');


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
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender Data is Not Valid!");
                
            }
        }

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

const User = mongoose.model('User', userSchema);

module.exports = User;

 