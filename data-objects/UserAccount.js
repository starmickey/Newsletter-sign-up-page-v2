let nextAccountToken = 0;

class UserAccount {
    constructor(id, name, status, port){
        this.id = String(id);
        this.name = String(name);
        this.status = Number(status);
        this.accountToken = nextAccountToken++;
        this.port = port;
    }

}

exports.UserAccount = UserAccount;