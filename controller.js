
const mongooseInterface = require(__dirname + '/mongoose.js');
const { UserAccount } = require(__dirname + '/data-objects/UserAccount.js');
const { UserAccountStatus } = require("./data-objects/UserAccountStatus");


// Status variables

const userAccounts = [];

// Export functions

function signup(name, password) {

    return new Promise((resolve, reject) => {
        
        mongooseInterface.createUser(name, password).then(function onFullFillment(userDTO) {
            const newUserAccount = new UserAccount(userDTO.id, userDTO.name, UserAccountStatus.loggedIn);
            userAccounts.push(newUserAccount);
            resolve(newUserAccount);

        }, function onRejection(error) {
            reject(error);
        })    
        
    })
}

exports.signup = signup;
