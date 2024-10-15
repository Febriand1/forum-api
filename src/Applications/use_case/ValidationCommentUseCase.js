class ValidationCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    async checkAvailabilityOwnerComment(commentId, owner) {
        const comment = await this._commentRepository.getCommentOwnerById(
            commentId
        );

        if (comment.owner !== owner) {
            throw new Error('VALIDATION_COMMENT.NOT_THE_OWNER');
        }
    }
}

module.exports = ValidationCommentUseCase;
