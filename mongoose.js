const mongoose = require('mongoose');
const { PostUpdateDTO } = require('./data-objects/PostUpdateDTO');
const { ResponseDTO } = require('./data-objects/ResponseDTO');
const { ResponseUpdateDTO } = require('./data-objects/ResponseUpdateDTO');
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



const responseSchema = new mongoose.Schema({
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
    post: {
        type: postSchema,
        required: true
    },
    rmDate: {
        type: Date,
        default: null
    }
});

const Response = new mongoose.model('response', responseSchema);



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




function getAllPosts(latestDate, numPosts) {

    let postDTOs = [];

    return new Promise((resolve, reject) => {

        Post.find({ date: { $lte: latestDate }, rmDate: null }, function (error, posts) {

            if (error) {
                reject(error);

            } else {
                const numPostsReturned = (posts.length > numPosts) ? numPosts : posts.length;
                for (let index = 0; index < numPostsReturned; index++) {
                    const post = posts[index];

                    const authorDTO = new AuthorDTO(post.author.id, post.author.name);
                    postDTOs.push(new PostDTO(post.id, post.name, post.content, post.date, authorDTO));
                }

                resolve(postDTOs);
            }
        })
    })
}


exports.getAllPosts = getAllPosts;





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



function saveResponse(respUpdateDTO) {

    if (respUpdateDTO.action === UpdateAction.create) {
        return createResponse(respUpdateDTO);

    } else if (respUpdateDTO.action === UpdateAction.modify) {
        return modifyResponse(respUpdateDTO);

    } else if (respUpdateDTO.action === UpdateAction.remove) {
        return removeResponse(respUpdateDTO);
    
    } else {
        console.log("action: " + respUpdateDTO.action + " undefined.");

    }

}


function createResponse(respUpdateDTO) {

    return new Promise((resolve, reject) => {

        Author.findOne({ _id: respUpdateDTO.authorId }, function (error, author) {

            if (error) {
                reject(error);

            } else if (author === null) {
                reject('author not found');

            } else {

                Post.findOne({ _id: respUpdateDTO.postId, rmDate: null }, function (error, post) {

                    if (error) {
                        reject(error);

                    } else if (post === null) {
                        reject('post not found');

                    } else {
                        const response = new Response({
                            content: respUpdateDTO.content,
                            date: new Date(),
                            author: author,
                            post: post
                        });

                        response.save().then(
                            function onFullFillment(resp) {
                                resolve(new ResponseDTO(resp.id, resp.content, resp.author.name, resp.date));
                            }, function onRejection(error) {
                                reject(error);
                            }
                        )
                    }
                })

            }
        });

    })

}


function modifyResponse(respUpdateDTO) {
    
    return new Promise((resolve, reject) => {
        
        Response.findOne({_id: respUpdateDTO.id, rmDate: null}, function (error, response) {
            
            if (error) {
                reject(error);

            } else if (response === null){
                reject('response not found')

            } else {
                response.content = respUpdateDTO.content;
                response.date = new Date();

                response.save().then(
                    function onSuccess (resp) {
                        resolve(new ResponseDTO(resp.id, resp.content, resp.author.name, resp.date));
                    }, 
                    function onError(error) {
                        reject(error);
                    }
                )                

            }            
        })
    })
}


function removeResponse(respUpdateDTO) {
    
    return new Promise((resolve, reject) => {
        
        Response.findOne({_id: respUpdateDTO.id, rmDate: null}, function (error, response) {
           
            if (error) {
                reject(error);

            } else if (response === null){
                reject('response not found')

            } else {
                response.rmDate = new Date();
                response.save().then(
                    function onSuccess(r) {
                        resolve('response successfully removed');
                    },
                    function onError(error) {
                        reject(error);
                    }
                )
            }
        });
    })
}