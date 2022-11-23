const userRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const {
    getUser,
    getUserById
} = require('../db/models/users');


// api/users/login sets `user` to the request body which getUser() destructures
userRouter.post('/login', async (req, res, next) => {

    const { userName, password } = req.body;

    try {
        const user = await getUser({userName, password})

        const token = jwt.sign({username: user.userName, id: user.id}, secret)

        const confirmation = {
            message: "you're logged in!",
            token: token,
            user: user
        }
        res.send(confirmation);
    } catch (error) {
        next(error)
    }
});

userRouter.get('/me', async (req, res, next) => {

    const prefix = 'Bearer ';
    
    try {
        const auth = req.headers.authorization;
        const token = auth.slice(prefix.length);
        
        let authorizedUser = jwt.verify(token, secret);
        if (authorizedUser.username) {
            const me = await getUserById(authorizedUser.id);
            res.send(me)
        } else {
            throw new Error('error getting user info');
        }
    } catch (error) {
        next(error);
    }

});


module.exports = userRouter;