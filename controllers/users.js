const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()

usersRouter.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users); 
})

usersRouter.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
})

usersRouter.post('/', async (req, res) => {
    const { name, username, password } = req.body;

    if (password.length < 4) {
      return response.status(400).json({ error: 'password must be at least 3 characters long' })
      }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        username,
        passwordHash: hashPassword
    });
    const result = await user.save();
    res.json(result);
})

usersRouter.put('/favorite', async (req, res) => {
    const body = req.body;
    const decodedToken = jwt.verify(req.token, 'supersecret');
    if (!decodedToken || !req.token) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }
    const user = await User.findById(decodedToken.id);
    if (!user) {
        return res.status(400).json({ error: 'user not found' });
    }
    if(user && user.favoritePokemons.includes(body.pokemon)){
        user.favoritePokemons.splice(user.favoritePokemons.indexOf(body.pokemon), 1);
        const result = await user.save();
        return res.status(201).json(result);
    }
    user.favoritePokemons = user.favoritePokemons.concat(body.pokemon);
    const result = await user.save();
    res.json(result);
})

module.exports = usersRouter;
