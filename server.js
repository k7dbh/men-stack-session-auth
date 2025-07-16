require('dotenv').config({ quiet: true })
const express = require('express')
const app = express()
const methodOverride = require('method-override')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const authController = require('./controllers/auth.controller')
const isSignedIn = require('./middleware/is-signed-in')

// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to mongoBD ${mongoose.connection.name}🎮`)
})

// MIDDLEWARE
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    })
}))

app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'my App', user: req.session.user })
})


// ROUTES
app.use('/auth', authController) // &&

app.use(isSignedIn)//it protects whats belows it
app.get('/vip-lounge', (req, res) => {
    res.send(`welcome ${req.session.user.username} 💻 `)
})


const port = process.env.PORT ? process.env.PORT : "3000"
// if(process.env.PORT){
//     const port = process.env.PORT
// }else{
//     const port = '3000'
// }
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`)
})
