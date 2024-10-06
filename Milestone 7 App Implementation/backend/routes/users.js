const router = require('express').Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');
const { logger } = require('./logger');

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            logger.error('Validation error:', error);
            return res.status(400).send({ status: "error", message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            logger.info('User with given email already exists:', req.body.email);
            return res.status(409).send({ status: "error", message: "User with given email already exists!" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create user with role (if provided, otherwise defaults to 'user')
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        
        logger.info('User created successfully:', req.body.email);
        res.status(201).send({
            status: "success",
            data: {
                message: "User created successfully!",
                user: { username: newUser.username, email: newUser.email, role: newUser.role }
            }
        });
    } catch (error) {
        logger.error('Internal Server Error:', error);
        res.status(500).send({ status: "error", message: "Internal Server Error!" });
    }
});

module.exports = router;
