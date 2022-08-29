require('dotenv').config();
const express = require('express')
const moongose = require('mongoose')
require('express-async-errors')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const colorRouter = require('./controllers/color')
const cors = require('cors')
const app = express();

const URI=process.env.DB_URI
const PORT = process.env.PORT || 3002;

console.log('Connecting to MongoDB...');
moongose.connect(URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

const tokenExtractor = async (request, response, next) => {    
  const authorization = await request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);         
  } else{
        request.token = null;
        }
  next();
};
 
app.use(tokenExtractor)

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

app.use(requestLogger);
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/color', colorRouter)

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
})

const unknownEndpoint = (request, response, next) => {
  response.status(404).json({ error: 'unknown endpoint' });
  next();
}

app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});