const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const Reply = require('../../Domains/replies/entities/Reply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async getReplyOwnerById(replyId) {
        const query = {
            text: 'SELECT owner FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('reply tidak ditemukan');
        }

        return result.rows[0];
    }

    async addReply(addReplies) {
        const { content, owner, commentId } = addReplies;
        const id = `reply-${this._idGenerator()}`;
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, content, commentId, owner, createdAt],
        };

        const result = await this._pool.query(query);

        return new Reply(result.rows[0]);
    }

    async deleteReply(ReplyId) {
        const query = {
            text: 'UPDATE replies SET is_delete = true WHERE id = $1',
            values: [ReplyId],
        };

        await this._pool.query(query);

        return true;
    }

    async getReplyByCommentId(commentId) {
        const query = {
            text: `SELECT replies.id, replies.content, replies.created_at AS date, users.username, replies.is_delete
            FROM replies
            JOIN users ON replies.owner = users.id
            WHERE replies.comment_id = $1
            ORDER BY date ASC`,
            values: [commentId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }
}

module.exports = ReplyRepositoryPostgres;
