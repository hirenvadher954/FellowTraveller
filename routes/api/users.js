const express = require('express')
const config = require('config');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar')
const router = express.Router();
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator');
const User = require('../../models/User')

// * @route Post api/users
// * @desc Register User
// * @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please Include Valid Email').isEmail(),
    check('password', 'Minimum Length 6').isLength({min: 6})

], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {name, email, password} = req.body;
    try {
        let user = await User.findOne({email});

        // ? See if User Exist
        if (user) {
            return res
                .status(400)
                .json({errors: [{msg: 'User already exist'}]})
        }

        // ? Get User Gravatar
        const avatar = gravatar.url(email, {s: '200', r: 'pg', d: 'mm'})
        user = new User({name, email, avatar, password})

        // ? Encrypt Password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

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