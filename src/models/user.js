const mongoose = require('mongoose');

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
        trim: true 
    },
    password: {
        type: String,
        required: true
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
        default: "https://www.mjunction.in/wp-content/uploads/2020/09/Dummy.jpg"
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

 