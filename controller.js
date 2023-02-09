
const mongooseInterface = require(__dirname + '/mongoose.js');
const { AuthorAccount } = require(__dirname + '/data-objects/AuthorAccount.js');
const { AuthorAccountStatus } = require("./data-objects/AuthorAccountStatus");
const { PostUI } = require(__dirname + '/data-objects/PostUI.js');


// Status variables

const authorAccounts = [];

// Export functions

function signOut(reqPort) {
    const authorAccount = authorAccounts.find(({ port }) => port === reqPort);
    const index = authorAccounts.indexOf(authorAccount);
    if (index > -1) {
        authorAccounts.splice(index, 1);
    }

}

exports.signOut = signOut;


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



function getAuthorAccount(reqPort) {
    return authorAccounts.find(({ port }) => port === reqPort);
}

exports.getAuthorAccount = getAuthorAccount;



function getAllPosts(latestDate) {

    let postUIs = [];
    
    return new Promise((resolve, reject) => {
        
        mongooseInterface.getAllPosts(latestDate, 10).then(
            function onFullFillment(postDTOs) {
                postDTOs.forEach(postDTO => {
                    postUIs.push(new PostUI(postDTO.id, postDTO.name,
                        postDTO.content, postDTO.date, postDTO.author.name));
                });

                resolve(postUIs);
            },

            function onRejection(error) {
                reject(error);
            }
        )
    })
}

exports.getAllPosts = getAllPosts;






