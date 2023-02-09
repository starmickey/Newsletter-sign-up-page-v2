const mongoose = require('mongoose');
const { PostUpdateDTO } = require('./data-objects/PostUpdateDTO');
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



function savePost(postUpdateDTO) {

    return new Promise((resolve, reject) => {

        User.findOne({ _id: postUpdateDTO.authorId, rmDate: null }, function (error, user) {
            if (error) {
                reject(error);

            } else if (user === null) {
                reject('user not found');

            } else if (postUpdateDTO.action === SavingAction.new) {
                const post = new Post({
                    name: postUpdateDTO.name,
                    content: postUpdateDTO.content,
                    date: new Date(),
                    author: user
                });

                post.save().then(function (newPost) {
                    resolve(new PostDTO(newPost.id, newPost.name, newPost.content))
                })

            } else if (postUpdateDTO.action === SavingAction.modified) {
                Post.findOne({ _id: postUpdateDTO.id, rmDate: null }, function (error, post) {
                    post.name = postUpdateDTO.name;
                    post.content = postUpdateDTO.content;


                    post.save().then(function (newPost) {
                        resolve(new PostDTO(newPost.id, newPost.name, newPost.content))
                    })
                })

            } else if (postUpdateDTO.action === SavingAction.removed) {
                Post.findOne({ _id: postUpdateDTO.id, rmDate: null }, function (error, post) {
                    post.rmDate = null;

                    post.save().then(function (newPost) {
                        resolve(new PostDTO(newPost.id, newPost.name, newPost.content))
                    })
                })

            } else {
                reject('Error. SavePost action: ' + postUpdateDTO.action);

            }

        })
    })
}


// getUser('test','test').then(function(user){
//     const postUpdateDTO = new PostUpdateDTO('', 'Test Post','conteeennnnnt', user.id, SavingAction.new);
//     savePost(postUpdateDTO).then(function (post) {
//         console.log(post);
//     },  function (error) {
//         console.log(error);
//     })
// }, function(error) {
//     console.log(error);
// })

