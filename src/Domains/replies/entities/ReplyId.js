class ReplyId {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, content, date, username, isDelete } = payload;

        this.id = id;
        this.content = isDelete ? '**balasan telah dihapus**' : content;
        this.date = date;
        this.username = username;
    }

    _verifyPayload({ id, content, date, username }) {
        if (!id || !username || !date || !content) {
            throw new Error('REPLY_ID.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof username !== 'string' ||
            !(date instanceof Date) ||
            typeof content !== 'string'
        ) {
            throw new Error('REPLY_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ReplyId;
