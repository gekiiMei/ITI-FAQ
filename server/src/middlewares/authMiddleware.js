const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => 
    authorization_header = req.headers['Authorization']
    const access_token = authorization_header && authorization_header.split(' ')[1]
    

    if (!access_token) {
        return res.status(401).json({msg: 'Missing Access Token.'})
    }

    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({msg:'Invalid Access Token.'})
        } 
        req.user = user;
        next();
    })
    
module.exports = authToken;
