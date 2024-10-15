const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const { content, owner, threadId } = useCasePayload;
        await this._threadRepository.verifyAvailableThread(threadId);
        const addComment = new AddComment({ content, owner, threadId });
        return this._commentRepository.addComment(addComment);
    }
}

module.exports = AddCommentUseCase;
