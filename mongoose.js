const mongoose = require('mongoose');
const { SavePostDTO } = require('./data-objects/SavePostDTO');
const { SavingAction } = require('./data-objects/SavingAction');
const { UserDTO } = require(__dirname + '/data-objects/UserDTO.js');
const { PostDTO } = require(__dirname + '/data-objects/PostDTO.js');



// Establish mongoose connection

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/journal');
}


// Schemas

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = new mongoose.model('user', userSchema);


const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    author: {
        type: userSchema,
        required: true
    },
    rmDate: {
        type: Date,
        default: null
    }

});

const Post = new mongoose.model('post', postSchema);


// Export functions

function createUser(name, password) {
    return new Promise((resolve, reject) => {
        User.findOne({ name: name }, function (error, user) {
            if (error) {
                reject(error);
            } else if (user !== null) {
                reject('user already created');
            } else {
                const user = new User({ name: name, password: password });
                user.save().then(function (user) {
                    resolve(new UserDTO(user.id, user.name));
                });

            }
        })

    })
}

exports.createUser = createUser;


function getUser(name, password) {
    return new Promise((resolve, reject) => {
        User.findOne({ name: name, password: password }, function (error, user) {
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

exports.getUser = getUser;



function savePost(savePostDTO) {

    return new Promise((resolve, reject) => {

        User.findOne({ _id: savePostDTO.authorId }, function (error, user) {
            if (error) {
                reject(error);

            } else if (user === null) {
                reject('user not found');

            } else if (savePostDTO.action === SavingAction.new) {
                const post = new Post({
                    name: savePostDTO.name,
                    content: savePostDTO.content,
                    date: new Date(),
                    author: user
                });

                post.save().then(function (post) {
                    resolve(new PostDTO(post.id, post.name, post.content))
                })
            }

        
        })
})
}

