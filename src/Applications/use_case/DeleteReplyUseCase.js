const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
    constructor({
        replyRepository,
        threadRepository,
        commentRepository,
        validationReplyUseCase,
    }) {
        this._replyRepository = replyRepository;
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._validationReplyUseCase = validationReplyUseCase;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, replyId, owner } = useCasePayload;
        const deleteReply = new DeleteReply({
            threadId,
            commentId,
            replyId,
            owner,
        });
        await this._threadRepository.verifyAvailableThread(
            deleteReply.threadId
        );
        await this._commentRepository.getCommentOwnerById(
            deleteReply.commentId
        );
        await this._validationReplyUseCase.checkAvailabilityOwnerReply(
            deleteReply.replyId,
            deleteReply.owner
        );
        return this._replyRepository.deleteReply(deleteReply.replyId);
    }
}

module.exports = DeleteReplyUseCase;
