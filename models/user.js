const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new moongose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: String,
    favoritePokemons: [String]
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

const User = moongose.model('User', userSchema);

module.exports = User;