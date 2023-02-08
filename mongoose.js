const mongoose = require('mongoose');
const { UserDTO } = require(__dirname + '/data-objects/UserDTO.js');


// Establish mongoose connection

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/journal');
    console.log('connection established');
}


// Schemas

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = new mongoose.model('user', userSchema);



// Export functions

function createUser(name, password) {
    return new Promise((resolve, reject) => {
        User.findOne({name: name}, function (error, user) {
            if(error) {
                reject(error);
            } else if (user !== null) {
                reject('user already created');
            } else {
                const user = new User({name: name, password: password});
                user.save().then(function (user) {
                    resolve(new UserDTO(user.id, user.name));
                });
                
            }
        })
        
    })
}

function getUser(name, password) {
    return new Promise((resolve, reject) => {
        User.findOne({name: name, password: password}, function (error, user) {
            if (error) {
                reject(error);
            } else if (user === null) {
                reject('user not found');

            } else {
                resolve(new UserDTO(user.id, user.name));
            }
        })
    })
}

getUser('test5','test').then(function onFullfilled(user) {
    console.log(user);
}, function onRejection(error) {
    console.log(error);
})
