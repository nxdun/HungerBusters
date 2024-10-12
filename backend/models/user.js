const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure emails are unique
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'expert', 'user'], default: 'user' } // Default role
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ 
        _id: this._id, email: this.email, role: this.role 
    }, process.env.JWTPRIVATEKEY, { expiresIn: '1d' });
    return token;
};

const User = mongoose.model('User', userSchema);

const validate = (data) => {
    const schema = joi.object({
        username: joi.string().required().label("User Name"),
        email: joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        role: joi.string().valid('admin', 'expert', 'user').optional().label("Role") // Role optional
    });

    return schema.validate(data);
}

module.exports = { User, validate };
