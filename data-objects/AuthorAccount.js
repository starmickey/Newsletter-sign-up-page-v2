let nextAccountToken = 0;

class AuthorAccount {
    constructor(id, name, status, port){
        this.id = String(id);
        this.name = String(name);
        this.status = Number(status);
        this.accountToken = nextAccountToken++;
        this.port = port;
    }

}

exports.AuthorAccount = AuthorAccount;