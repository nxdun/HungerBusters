const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//validation function
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');


const userSchema = new mongoose.Schema({
    username:{ type: String, required: true },
    email:{ type: String, required: true },
    password:{ type: String, required: true }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ 
        _id: this._id,
    }, process.env.JWTPRIVATEKEY, { expiresIn: '1d' });
    return token;
};

const User = mongoose.model('User', userSchema);

const validate = (data) => {
    const schema = joi.object({
        username: joi.string().required().label("User Name"),
        email: joi.string().required().label("Email"),
        password: passwordComplexity().required().label("Password")
    });
    return schema.validate(data);
}

module.exports = { User, validate };