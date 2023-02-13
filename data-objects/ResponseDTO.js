class ResponseDTO {
    constructor(id, content, authorName, date) {
        this.id = String(id);
        this.content = String(content);
        this.authorName = String(authorName);
        this.date = date;
    }
}

exports.ResponseDTO = ResponseDTO;