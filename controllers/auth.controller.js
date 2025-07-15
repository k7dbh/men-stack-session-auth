const express = require('express')
const User = require('../models/user')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('does the auth route work?')
})

// SIGN UP VIEW
router.get('/sign-up', (req,res) => {
    res.render('auth/sign-up.ejs')
})

// POST A NEW USER TO THE DATABASE when the form is submitted
router.post('/sign-up', async (req, res) => { // &&
    // get data from the form (req.body)
    // check if someone already exists
    console.log(req.body)
    const userInDatabase = await User.findOne({ username: req.body.username })
    if(userInDatabase){
        return res.send('Username already taken.')
    }
    // check that password and confirmPassword are the same
    if(req.body.password !== req.body.confirmPassword) {
        return res.send('Password and confirm password must match.')
    }
    // check for password complexity (LEVEL UP)
    // hash the password
    const newUser = await User.create(req.body)
    res.send(`Thanks for signing up ${newUser.username} `)
})

module.exports = router