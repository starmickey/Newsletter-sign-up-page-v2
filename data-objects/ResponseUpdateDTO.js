class ResponseUpdateDTO {
    constructor(id, content, authorId, postId, action) {
        this.id = String(id);
        this.content = String(content);
        this.authorId = String(authorId);
        this.postId = String(postId);
        this.action = Number(action);
    }
}

exports.ResponseUpdateDTO = ResponseUpdateDTO;