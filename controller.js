
const mongooseInterface = require(__dirname + '/mongoose.js');
const { AuthorAccount } = require(__dirname + '/data-objects/AuthorAccount.js');
const { AuthorAccountStatus } = require("./data-objects/AuthorAccountStatus");


// Status variables

const userAccounts = [];

// Export functions

function signOut(reqPort) {
    const authorAccount = userAccounts.find(({ port }) => port === reqPort);
    const index = userAccounts.indexOf(authorAccount);
    if (index > -1) {
        userAccounts.splice(index, 1);
    }

}

exports.signOut = signOut;


function signup(name, password, port) {

    return new Promise((resolve, reject) => {

        mongooseInterface.createUser(name, password).then(function onFullFillment(authorDTO) {
            signOut(port);
            const newUserAccount = new AuthorAccount(authorDTO.id, authorDTO.name, AuthorAccountStatus.loggedIn, port);
            userAccounts.push(newUserAccount);
            resolve(newUserAccount);

        }, function onRejection(error) {
            reject(error);
        })

    })
}

exports.signup = signup;



function login(name, password, port) {
    console.log(userAccounts);

    return new Promise((resolve, reject) => {

        mongooseInterface.getUser(name, password).then(function onFullFillment(authorDTO) {
            signOut(port);
            const newUserAccount = new AuthorAccount(authorDTO.id, authorDTO.name, AuthorAccountStatus.loggedIn, port);
            userAccounts.push(newUserAccount);
            resolve(newUserAccount);

        }, function onRejection(error) {
            reject(error);
        });

    })
}

exports.login = login;


function getUserAccount(reqPort) {
    return userAccounts.find(({ port }) => port === reqPort);
}

exports.getUserAccount = getUserAccount;




