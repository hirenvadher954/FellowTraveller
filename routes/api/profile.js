const {check, validationResult} = require('express-validator');
const express = require('express')
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const router = express.Router();

// * @route GET api/profile/me
// * @desc GET current user profile
// * @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate(
            'user',
            ['name', 'avatar']
        );
        if (!profile) {
            res.status(400).json({msg: 'No Profile'})
        }
        res.json(profile)
    } catch (e) {
        console.log(e._message);
        res.status(500).send('Server Error')
    }
});

// * @route GET api/profile
// * @desc GET All Profile
// * @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)
    } catch (e) {
        console.log(e._message);
        res.status(500).send('Server Error')
    }
});

// * @route GET api/profile/user/:user_id
// * @desc GET profile by User Id
// * @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.find({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).json({msg: 'Profile Not Found'});
        res.json(profile)
    } catch (e) {
        if (e.kind === 'ObjectId') return res.status(400).json({msg: 'Profile Not Found'});
        res.status(500).send('Server Error')
    }
});

// * @route POST api/profile
// * @desc  Create or Update Current User Profile
// * @access Private
router.post('/', [auth,
    [
        check('location', 'Location is required')
            .not()
            .isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {location, gender, school, college, interestedPlaces} = req.body;

    // * Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (location) profileFields.location = location;
    if (gender) profileFields.gender = gender;

    if (interestedPlaces) {
        profileFields.interestedPlaces = interestedPlaces.split(',')
            .map(interestedPlace => interestedPlace.trim())
    }
    profileFields.education = {}
    if (school) profileFields.education.school = school;
    if (college) profileFields.education.college = college;

    try {
        let profile = await Profile.findOne({user: req.user.id});

        if (profile) {
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true},
                {useFindAndModify: false}
            );
            return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
    } catch (e) {
        console.log(e.message)
        res.status(500).send('Server Error');
    }
});

// * @route POST api/profile
// * @desc  Delete Current User Profile
// * @access Private
router.delete('', [auth], async (req, res) => {
    try {
        // !  Remove Profile
        await Profile.findOneAndDelete({user: req.user.id})
        // ! Remove User
        await User.findOneAndDelete({_id: req.user.id});
        res.json({msg: 'Msg Deleted'})
    } catch (e) {
        console.log(e.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;