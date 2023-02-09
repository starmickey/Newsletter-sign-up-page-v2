
const mongooseInterface = require(__dirname + '/mongoose.js');
const { AuthorAccount } = require(__dirname + '/data-objects/AuthorAccount.js');
const { AuthorAccountStatus } = require("./data-objects/AuthorAccountStatus");


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


function signup(name, password, port) {

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

exports.signup = signup;



function login(name, password, port) {
    console.log(authorAccounts);

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




