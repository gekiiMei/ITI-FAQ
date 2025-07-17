const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.login = async (req, res) => {
    const user_in = req.body.user_in;
    const pass_in = req.body.pass_in;

    if ((await User.findAll({where:{username:user_in}})).length===0) {
        console.log("not found")
        return res.status(404).json({msg:'User ' + user_in + 'not found.', status:404});
    }
    console.log("user found")
    user = await User.findOne({
        attributes:['user_id', 'hashed_password'],
        where: {username:user_in}
    })
    queried_user_id = user.user_id
    hashed_pass = user.hashed_password
    console.log("(debug) queried user id: " + queried_user_id)
    bcrypt.compare(pass_in, hashed_pass, (e, crypt_response) => {
        if (e) {
            console.log("(debug) pass_in type: " + typeof(pass_in))
            console.log("(debug) hashed_pass type: " + typeof(hashed_pass))
            console.log("debug: register bcrypt error")
            console.log(e)
            return res.status(500).json({msg:'Unexpected error.', status:500});
        }
        if (!crypt_response) {
            return res.status(401).json({msg:'Incorrect password.', status:401});
        } else {
            access_token = jwt.sign({user_id: queried_user_id, username: user_in}, 
                process.env.ACCESS_TOKEN_SECRET, 
                {expiresIn: process.env.ACCESS_TOKEN_LIFESPAN})
            refresh_token = jwt.sign({user_id: queried_user_id, username: user_in}, 
                process.env.REFRESH_TOKEN_SECRET, 
                {expiresIn: process.env.REFRESH_TOKEN_LIFESPAN})
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: process.env.REFRESH_TOKEN_LIFESPAN_INTDAYS /*<- poor implementation, i know -Harley*/  * 24 * 60 * 60 * 1000
            })
            return res.status(200).json({msg: 'Successful login', access_token:access_token, user_id: queried_user_id});
        }
    })
}

exports.signup = async (req, res) => {
    const user_in = req.body.user_in;
    const pass_in = req.body.pass_in;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(pass_in, salt, async (err, hash) => {
            console.log("Hashed pass: " + hash)
            const [new_user, created] = await User.findOrCreate({
                where:{username:user_in},
                defaults:{
                    hashed_password:hash,
                    username:user_in,
                }
            })
            if (!created) {
                console.log("debug: user exists")
                return res.status(409).json({msg:'Username ' + user_in + 'is already taken.', status:409});
            } else {
                console.log("debug: user created")
                return res.status(201).json({msg:'User ' + user_in + " ID: " + new_user.id})
            }
        })
    });
}

exports.refresh = async (req, res) => {
    refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
        return res.status(401).json({msg:'Token expired.'})
    }
    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_LIFESPAN, (err, user) => {
        if (err) {
            return res.status(403).json({msg:'Invalid token.'})
        }
        const new_access_token = jwt.sign({user_id: user.user_id, username: user.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.ACCESS_TOKEN_LIFESPAN}
        )

        return res.status(200).json({msg:'Successfully refreshed token.'})
    })
}

exports.remove_refresh = async (req, res) => {
    console.log('attempting to clear cookie')
    return res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    }).json({msg:'Logged out'})
}