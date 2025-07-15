require('dotenv').config()
const express = require('express')
const app = express()
const methodOverride = require('method-override')
const morgan = require('morgan')

const mongoose = require('mongoose')

// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to mongoBD ${mongoose.connection.name}🎮`)
})

// MIDDLEWARE
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

// ROUTES
app.get('/', (req,res) => { // make it render 
    res.render('index.ejs',{ title: 'my App'})
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
