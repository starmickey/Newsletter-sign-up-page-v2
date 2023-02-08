
const mongooseInterface = require(__dirname + '/mongoose.js');
const { UserAccount } = require(__dirname + '/data-objects/UserAccount.js');
const { UserAccountStatus } = require("./data-objects/UserAccountStatus");


// Status variables

const userAccounts = [];

// Export functions

function signup(name, password, port) {

    return new Promise((resolve, reject) => {

        mongooseInterface.createUser(name, password).then(function onFullFillment(userDTO) {
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

    return new Promise((resolve, reject) => {
        
        mongooseInterface.getUser(name, password).then(function onFullFillment(userDTO) {
            const newUserAccount = new UserAccount(userDTO.id, userDTO.name, UserAccountStatus.loggedIn, port);
            userAccounts.push(newUserAccount);
            resolve(newUserAccount);
            
        }, function onRejection(error) {
            reject(error);
        });   

    })
}

exports.login = login;


function getUserAccount (reqPort) {
    return userAccounts.find(({ port }) => port === reqPort);
}

exports.getUserAccount = getUserAccount;