class PostDTO {
    constructor(id, name, content, author) {
        this.id = String(id);
        this.name = String(name);
        this.content = String(content);
        this.author = author;
    }
}

exports.PostDTO = PostDTO;