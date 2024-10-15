class ReplyRepository {
    async addReply(newReply) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteReply(replyId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getReplyByCommentId(commentId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getReplyOwnerById(replyId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ReplyRepository;
