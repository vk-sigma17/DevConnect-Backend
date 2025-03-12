const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName) {
        throw new Error("Name is Not Valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not Valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password!")
    }
};

const validateLoginData = (req) => {
	const { emailId, password } = req.body;
	if (!validator.isEmail(emailId)) {
		throw new Error("Email address is not valid");
	} else if (!validator.isStrongPassword(password)) {
		throw new Error("Passwords is not valid");
	}
};


const validateEditProfileData = (req) => {
    const allowedEditField = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "skills", "about"]

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditField.includes(field));

    return isEditAllowed;
}  

const validatePasswordData = (req) => {
	const { newPassword } = req.body;
	if (!validator.isStrongPassword(newPassword)) {
		throw new Error(
			"Password must be at least 8 characters long, contain a combination of uppercase and lowercase letters, numbers, and special characters"
		);
	}
};


module.exports = {
    validateSignUpData,
    validateLoginData,
    validateEditProfileData,
    validatePasswordData
}