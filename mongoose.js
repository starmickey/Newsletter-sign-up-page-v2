const mongoose = require('mongoose');
const { PostUpdateDTO } = require('./data-objects/PostUpdateDTO');
const { UpdateAction } = require('./data-objects/UpdateAction');
const { AuthorDTO } = require(__dirname + '/data-objects/AuthorDTO.js');
const { PostDTO } = require(__dirname + '/data-objects/PostDTO.js');



// Establish mongoose connection

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/journal');
}


// Schemas

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Author = new mongoose.model('author', authorSchema);


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
        type: authorSchema,
        required: true
    },
    rmDate: {
        type: Date,
        default: null
    }

});

const Post = new mongoose.model('post', postSchema);


// Export functions

function createAuthor(name, password) {
    return new Promise((resolve, reject) => {
        Author.findOne({ name: name }, function (error, author) {
            if (error) {
                reject(error);
            } else if (author !== null) {
                reject('author already created');
            } else {
                const author = new Author({ name: name, password: password });
                author.save().then(function (author) {
                    resolve(new AuthorDTO(author.id, author.name));
                });

            }
        })

    })
}

exports.createAuthor = createAuthor;


function getAuthor(name, password) {
    return new Promise((resolve, reject) => {
        Author.findOne({ name: name, password: password }, function (error, author) {
            if (error) {
                reject(error);
            } else if (author === null) {
                reject('author not found');

            } else {
                resolve(new AuthorDTO(author.id, author.name));
            }
        })
    })
}

exports.getAuthor = getAuthor;



function savePost(postUpdateDTO) {

    return new Promise((resolve, reject) => {

        Author.findOne({ _id: postUpdateDTO.authorId }, function (error, author) {
            if (error) {
                reject(error);

            } else if (author === null) {
                reject('author not found');


            } else if (postUpdateDTO.action === UpdateAction.create) {
                const post = new Post({
                    name: postUpdateDTO.name,
                    content: postUpdateDTO.content,
                    date: new Date(),
                    author: author
                });

                post.save().then(function (newPost) {
                    const authorDTO = new AuthorDTO(author.id, author.name);
                    resolve(new PostDTO(newPost.id, newPost.name, newPost.content, newPost.date, authorDTO))
                })


            } else if (postUpdateDTO.action === UpdateAction.modify
                || postUpdateDTO.action === UpdateAction.remove) {

                Post.findOne({ _id: postUpdateDTO.id, rmDate: null }, function (error, post) {
                    if (error) {
                        reject(error)
                    } else if (post === null) {
                        reject('post not found')

                    } else {
                        if (postUpdateDTO.action === UpdateAction.modify) {
                            post.name = postUpdateDTO.name;
                            post.content = postUpdateDTO.content;

                            post.save().then(function (newPost) {
                                const authorDTO = new AuthorDTO(author.id, author.name);
                                resolve(new PostDTO(newPost.id, newPost.name, newPost.content, newPost.date, authorDTO));
                            })

                        } else {
                            post.rmDate = new Date();
                            post.save().then(function () {
                                resolve('post removed');
                            })

                        }


                    }
                })

            } else {
                reject('Error. SavePost action: ' + postUpdateDTO.action);

            }

        })
    })
}


exports.savePost = savePost;




function getPostById(postId) {

    return new Promise((resolve, reject) => {

        Post.findOne({ _id: postId, rmDate: null }, function (error, post) {

            if (error) {
                reject(error)

            } else if (post === null) {
                reject('post not found')

            } else {
                const author = new AuthorDTO(post.author.id, post.author.name);
                resolve(new PostDTO(post.id, post.name, post.content, post.date, author));
            }
        })
    })
}


exports.getPostById = getPostById;


