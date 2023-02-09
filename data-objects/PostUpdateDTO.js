class PostUpdateDTO {
    constructor(id, name, content, authorId, action){
        this.id = String(id);
        this.name = name.charAt(0).toUpperCase() + name.slice(1);
        this.content = String(content);
        this.authorId = String(authorId);
        this.action = Number(action);
    }
}

exports.PostUpdateDTO = PostUpdateDTO;