
const mongooseInterface = require(__dirname + '/mongoose.js');
const { UserAccount } = require(__dirname + '/data-objects/UserAccount.js');
const { UserAccountStatus } = require("./data-objects/UserAccountStatus");


// Status variables

const userAccounts = [];

// Export functions

function signOut(reqPort) {
    const userAccount = userAccounts.find(({ port }) => port === reqPort);
    const index = userAccounts.indexOf(userAccount);
    if (index > -1) {
        userAccounts.splice(index, 1);
    }

}

exports.signOut = signOut;


function signup(name, password, port) {

    return new Promise((resolve, reject) => {

        mongooseInterface.createUser(name, password).then(function onFullFillment(userDTO) {
            signOut(port);
            const newUserAccount = new UserAccount(userDTO.id, userDTO.name, UserAccountStatus.loggedIn, port);
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

        mongooseInterface.getUser(name, password).then(function onFullFillment(userDTO) {
            signOut(port);
            const newUserAccount = new UserAccount(userDTO.id, userDTO.name, UserAccountStatus.loggedIn, port);
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




