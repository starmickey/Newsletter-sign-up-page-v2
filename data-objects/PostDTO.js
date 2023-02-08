class PostDTO {
    constructor(id, name, content) {
        this.id = String(id);
        this.name = String(name);
        this.content = String(content);
    }
}

exports.PostDTO = PostDTO;