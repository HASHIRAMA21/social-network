const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model')

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async(err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge: 1 });
                next();
            } else {
                console.log('decode token' + decodedToken);
                let user = await UserModel.findById(decodedToken);
                res.local.user = user;
                console.log(user)
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}