const bcrypt = require('bcryptjs');
const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User')
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

// * @route GET api/auth
// * @desc Test Route
// * @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (e) {
        console.log(e._message);
        res.status(500).send('Server Error')
    }
});

// * @route POST api/users
// * @desc Login & get Token
// * @access Public
router.post('/', [
    check('email', 'Please Include Valid Email').isEmail(),
    check('password', 'Password is Required').exists()

], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});

        // ? See if User Exist
        if (!user) {
            return res
                .status(400)
                .json({errors: [{msg: 'Invalid Credentials'}]})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res
                .status(400)
                .json({errors: [{msg: 'Invalid Credentials'}]})
        }

        // ? Return JsonWebToken
        const payload = {user: {id: user.id}};
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000}, (error, token) => {
            if (error) throw error;
            res.json({token});
        })
    } catch (e) {
        console.log(e.message);
        res.status(400).send('Server Error')
    }
});

module.exports = router;