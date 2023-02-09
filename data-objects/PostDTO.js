class PostDTO {
    constructor(id, name, content, date, author) {
        this.id = String(id);
        this.name = String(name);
        this.content = String(content);
        this.date = date;
        this.author = author;
    }
}

exports.PostDTO = PostDTO;