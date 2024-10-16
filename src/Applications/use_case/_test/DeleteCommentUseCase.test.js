const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

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

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );

        commentRepository.getCommentOwnerById = jest.fn(() =>
            Promise.resolve({
                id: 'comment-123',
                owner: 'user-123',
            })
        );

        commentRepository.deleteComment = jest.fn(() => Promise.resolve(true));

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository,
            threadRepository,
        });

        // Action
        await deleteCommentUseCase.execute(useCasePayload);

        // Assert
        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload.threadId
        );
        expect(commentRepository.getCommentOwnerById).toBeCalledWith(
            useCasePayload.commentId
        );
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

        // mock function
        threadRepository.verifyAvailableThread = jest.fn();
        commentRepository.getCommentOwnerById = jest.fn();
        commentRepository.deleteComment = jest.fn();

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository,
            threadRepository,
        });

        // Action & Assert
        await expect(
            deleteCommentUseCase.execute(useCasePayload)
        ).rejects.toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PARAMETER');

        // Assert
        expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
        expect(commentRepository.getCommentOwnerById).not.toBeCalledWith();
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

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(false)
        );
        commentRepository.getCommentOwnerById = jest.fn(() =>
            Promise.resolve()
        );
        commentRepository.deleteComment = jest.fn(() => Promise.resolve(false));

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository,
            threadRepository,
        });

        // Action & Assert
        await expect(
            deleteCommentUseCase.execute(useCasePayload)
        ).rejects.toThrowError(
            'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );

        // Assert
        expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
        expect(commentRepository.getCommentOwnerById).not.toBeCalledWith();
        expect(commentRepository.deleteComment).not.toBeCalledWith();
    });

    it('should throw error when user is not the owner', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        const commentRepository = new CommentRepository();
        const threadRepository = new ThreadRepository();

        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );

        commentRepository.getCommentOwnerById = jest.fn(() =>
            Promise.resolve({
                id: 'comment-123',
                owner: 'user-456',
            })
        );

        commentRepository.deleteComment = jest.fn(() => Promise.resolve(false));

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository,
            threadRepository,
        });

        // Action & Assert
        await expect(
            deleteCommentUseCase.execute(useCasePayload)
        ).rejects.toThrowError('VALIDATION_COMMENT.NOT_THE_OWNER');

        // Assert
        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload.threadId
        );
        expect(commentRepository.getCommentOwnerById).toBeCalledWith(
            useCasePayload.commentId
        );
        expect(commentRepository.deleteComment).not.toBeCalledWith();
    });
});
