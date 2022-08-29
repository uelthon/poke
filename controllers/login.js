const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req,res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ error: 'user not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'invalid password' });
    }
    const token = jwt.sign({ id: user._id, username: user.username}, 'supersecret');
    res.json({ username: user.username, name: user.name, id: user.id , token });
})

module.exports = loginRouter;