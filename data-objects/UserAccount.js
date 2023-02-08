let nextAccountToken = 0;

class UserAccount {
    constructor(id, name, status){
        this.id = String(id);
        this.name = String(name);
        this.status = Number(status);
        this.accountToken = nextAccountToken++;
    }

}

exports.UserAccount = UserAccount;