const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ValidationCommentUseCase = require('../ValidationCommentUseCase');

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        // mock dependency
        const commentRepository = new CommentRepository();
        const threadRepository = new ThreadRepository();
        const validationCommentUseCase = new ValidationCommentUseCase(
            commentRepository
        );

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );
        validationCommentUseCase.checkAvailabilityOwnerComment = jest.fn(() =>
            Promise.resolve()
        );
        commentRepository.deleteComment = jest.fn(() => Promise.resolve(true));

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository,
            threadRepository,
            validationCommentUseCase,
        });

        // Action
        await deleteCommentUseCase.execute(useCasePayload);

        // Assert
        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload.threadId
        );
        expect(
            validationCommentUseCase.checkAvailabilityOwnerComment
        ).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(commentRepository.deleteComment).toBeCalledWith(
            useCasePayload.commentId
        );
    });

    it('should throw error if use case payload not contain needed parameter', async () => {
        // Arrange
        const useCasePayload = {};

        // mock dependency
        const commentRepository = new CommentRepository();
        const threadRepository = new ThreadRepository();
        const validationCommentUseCase = new ValidationCommentUseCase(
            commentRepository
        );

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve()
        );
        validationCommentUseCase.checkAvailabilityOwnerComment = jest.fn(() =>
            Promise.resolve()
        );
        commentRepository.deleteComment = jest.fn(() => Promise.resolve());

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository,
            threadRepository,
            validationCommentUseCase,
        });

        // Action & Assert
        await expect(
            deleteCommentUseCase.execute(useCasePayload)
        ).rejects.toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PARAMETER');

        // Assert
        expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
        expect(
            validationCommentUseCase.checkAvailabilityOwnerComment
        ).not.toBeCalledWith();
        expect(commentRepository.deleteComment).not.toBeCalledWith();
    });

    it('should throw error if use case payload not meet data type specification', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 123,
            commentId: 123,
            owner: 123,
        };

        const commentRepository = new CommentRepository();
        const threadRepository = new ThreadRepository();
        const validationCommentUseCase = new ValidationCommentUseCase(
            commentRepository
        );

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve()
        );
        validationCommentUseCase.checkAvailabilityOwnerComment = jest.fn(() =>
            Promise.resolve()
        );
        commentRepository.deleteComment = jest.fn(() => Promise.resolve());

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository,
            threadRepository,
            validationCommentUseCase,
        });

        // Action & Assert
        await expect(
            deleteCommentUseCase.execute(useCasePayload)
        ).rejects.toThrowError(
            'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );

        // Assert
        expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
        expect(
            validationCommentUseCase.checkAvailabilityOwnerComment
        ).not.toBeCalledWith();
        expect(commentRepository.deleteComment).not.toBeCalledWith();
    });
});
