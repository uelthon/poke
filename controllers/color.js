const colorRouter = require('express').Router();
const { getColorFromURL } = require('color-thief-node');

colorRouter.post('/', async (req, res) => {
    const {url} = req.body;
    const color = await getColorFromURL(url);
   
    res.json(color);
})

colorRouter.post('/test', async (req, res) => {
    const {name} = req.body;
    res.json({ name });
})

module.exports = colorRouter;