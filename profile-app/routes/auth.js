const express = require('express')
const passport = require('passport')
const authRoutes = express.Router()
const User = require('../models/User.model')
const bcrypt = require('bcrypt')

authRoutes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, failureDetails, user) => {
        if(err) {
            res.status(500).json({
                message: 'Something went wrong with authenticating user'
            })
        }
        if(!user) {
            res.status(401).json(failureDetails)
        }
        req.login(user, (err) => {
            if(err) {
                return res
                    .status(500)
                    .json({message: 'Something went wrong with session save!'})
            }
            // user.password = undefined;
            res.status(200).json({message: 'User logged'})
        })
    })(req, res, next);
})

authRoutes.post('/signup', (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    const campus = req.body.campus
    const course = req.body.course

    if(username === '' || password === '' || campus === '' || course === '') {
        res.status(400).json({ message: 'All fields mandatory' })
        return;
    }

    User.findOne({ username }, (err, foundUser) => {
        if(err){
            res.status(500).json({
                message: 'Username check went bad'
            });
            return;
        }
        if(foundUser){
            res.status(400).json({
                message: 'Username is already in use'
            });
            return;
        }
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const newUser = new User({
            username: username,
            password: hashedPassword,
            campus: campus, 
            course: course,
        })

        newUser.save((err) => {
            if(err) {
                res.status(400).json({
                    message: 'Error saving new user to database'
                })
                return;
            }
            req.login(newUser, (err) => {
                if(err) {
                    res.status(500).json({
                        message: 'Login after signup error'
                    })
                    return;
                }
                // user.password = undefined
                res.status(200).json({
                    message: 'User created'
                }, req.user )
            })
        })
    })
})

authRoutes.post('/upload', (req, res, next) => {
    
})

authRoutes.post('/edit', (req, res, next) => {
    
})

authRoutes.post('/logout', (req, res, next) => {
    req.logout();
    res.status(200).json({ message: 'Logged out' })
})

authRoutes.get('/loggedin', (req, res) => {
    if (req.user) {
        console.log({ user: req.user });
        req.user.password = undefined;
        res.status(200).json(req.user);
        return;
    }
    res.status(401).json({ message: "Unauthorized Access!" });
})


module.exports = authRoutes