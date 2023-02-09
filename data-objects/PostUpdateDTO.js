class PostUpdateDTO {
    constructor(id, name, content, authorId, action){
        this.id = String(id);
        this.name = String(name);
        this.content = String(content);
        this.authorId = String(authorId);
        this.action = Number(action);
    }
}

exports.PostUpdateDTO = PostUpdateDTO;