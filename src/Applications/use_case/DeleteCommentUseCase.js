const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
    constructor({
        commentRepository,
        threadRepository,
        // validationCommentUseCase,
    }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
        // this._validationCommentUseCase = validationCommentUseCase;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, owner } = useCasePayload;
        const deleteComment = new DeleteComment({ threadId, commentId, owner });

        await this._verifyPayload(deleteComment);
        return this._commentRepository.deleteComment(deleteComment.commentId);
    }

    async _verifyPayload(payload) {
        const { threadId, commentId, owner } = payload;

        await this._threadRepository.verifyAvailableThread(threadId);
        const comment = await this._commentRepository.getCommentOwnerById(
            commentId
        );

        if (comment.owner !== owner) {
            throw new Error('VALIDATION_COMMENT.NOT_THE_OWNER');
        }
    }
}

module.exports = DeleteCommentUseCase;
