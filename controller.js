
const mongooseInterface = require(__dirname + '/mongoose.js');
const { AuthorAccount } = require(__dirname + '/data-objects/AuthorAccount.js');
const { AuthorAccountStatus } = require("./data-objects/AuthorAccountStatus");
const { PostUpdateDTO } = require("./data-objects/PostUpdateDTO");
const { UpdateAction } = require("./data-objects/UpdateAction");
const { PostUI } = require(__dirname + '/data-objects/PostUI.js');


// Status variables

const authorAccounts = [];



// Export functions

function isLoggedIn(reqPort) {
    const authorAccount = authorAccounts.find(({ port }) => port === reqPort);
    return authorAccount !== undefined;
}

exports.isLoggedIn = isLoggedIn;



function getAuthorAccount(reqPort) {
    return authorAccounts.find(({ port }) => port === reqPort);
}

exports.getAuthorAccount = getAuthorAccount;



function signUp(name, password, port) {

    return new Promise((resolve, reject) => {

        mongooseInterface.createAuthor(name, password).then(function onFullFillment(authorDTO) {
            signOut(port);
            const newAuthorAccount = new AuthorAccount(authorDTO.id, authorDTO.name, AuthorAccountStatus.loggedIn, port);
            authorAccounts.push(newAuthorAccount);
            resolve(newAuthorAccount);

        }, function onRejection(error) {
            reject(error);
        })
    })
}

exports.signUp = signUp;



function login(name, password, port) {

    return new Promise((resolve, reject) => {

        mongooseInterface.getAuthor(name, password).then(function onFullFillment(authorDTO) {
            signOut(port);
            const newAuthorAccount = new AuthorAccount(authorDTO.id, authorDTO.name, AuthorAccountStatus.loggedIn, port);
            authorAccounts.push(newAuthorAccount);
            resolve(newAuthorAccount);

        }, function onRejection(error) {
            reject(error);
        });

    })
}

exports.login = login;



function signOut(reqPort) {
    const authorAccount = authorAccounts.find(({ port }) => port === reqPort);
    const index = authorAccounts.indexOf(authorAccount);
    if (index > -1) {
        authorAccounts.splice(index, 1);
    }
}

exports.signOut = signOut;



function getAllPosts(latestDate) {

    let postUIs = [];

    return new Promise((resolve, reject) => {

        mongooseInterface.getAllPosts(latestDate, 10).then(
            function onFullFillment(postDTOs) {
                postDTOs.forEach(postDTO => {
                    postUIs.push(new PostUI(postDTO.id, postDTO.name,
                        postDTO.content, postDTO.date, postDTO.author.name, []));
                });
                resolve(postUIs.reverse());
            },

            function onRejection(error) {
                reject(error);
            }
        )
    })
}

exports.getAllPosts = getAllPosts;



function getPost(id) {

    return new Promise((resolve, reject) => {

        mongooseInterface.getPostById(id).then(

            function onFullfillment(post) {
                const postUI = new PostUI(post.id, post.name, post.content, post.date, post.author.name, []);
                resolve(postUI);
            }, 
            function onRejection(error) {
                reject(error);
            })
    })
}

exports.getPost = getPost;



function createPost(name, content, port) {
    const authorAccount = getAuthorAccount(port);
    const post = new PostUpdateDTO('', name, content, authorAccount.id, UpdateAction.create);
    return mongooseInterface.savePost(post);
}

exports.createPost = createPost;







