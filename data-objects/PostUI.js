var dateFormat = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
}


class PostUI {
    constructor(id, name, content, date, authorName, responses ) {
        this.id = String(id);
        this.name = String(name);
        this.content = String(content);
        this.date = date.toLocaleDateString("en-US", dateFormat);
        this.authorName = authorName.charAt(0).toUpperCase() + authorName.slice(1);
        this.responses = responses;
    }
}

exports.PostUI = PostUI;