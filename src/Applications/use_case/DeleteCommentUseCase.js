const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
    constructor({
        commentRepository,
        threadRepository,
        validationCommentUseCase,
    }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
        this._validationCommentUseCase = validationCommentUseCase;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, owner } = useCasePayload;
        const deleteComment = new DeleteComment({ threadId, commentId, owner });
        await this._threadRepository.verifyAvailableThread(
            deleteComment.threadId
        );
        await this._validationCommentUseCase.checkAvailabilityOwnerComment(
            deleteComment.commentId,
            deleteComment.owner
        );
        return this._commentRepository.deleteComment(deleteComment.commentId);
    }
}

module.exports = DeleteCommentUseCase;
