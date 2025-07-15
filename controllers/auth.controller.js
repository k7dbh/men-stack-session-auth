const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user.js')

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
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword
    const newUser = await User.create(req.body)
    res.send(`Thanks for signing up ${newUser.username} `)
})

// SIGN IN VIEW
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
})

// POST TO SIGN THE USER IN (CREATE SESSION)
router.post('/sign-in', async (req, res) => {
   const userInDatabase = await User.findOne({ username: req.body.username })
   console.log('userInDatabase: ', userInDatabase)
   // if userInDatabase is NOT NULL (that means the user exists) then send this message
    if(!userInDatabase){
        return res.send('Login failed. Please try again.')
    }
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)
    if(!validPassword){
        return res.send('Login failed. Please try again.')
    }
    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    }
    res.redirect('/')
})

module.exports = router