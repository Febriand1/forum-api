const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const Comment = require('../../../Domains/comments/entities/Comment');

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const owner = 'user-123';
        const useCasePayload = {
            content: 'new comment',
            owner,
            threadId: 'thread-123',
        };

        const commentRepository = new CommentRepository();
        const threadRepository = new ThreadRepository();

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );
        commentRepository.addComment = jest.fn(() =>
            Promise.resolve(
                new Comment({
                    id: 'comment-123',
                    content: useCasePayload.content,
                    owner,
                })
            )
        );

        // create use case instance
        const addCommentUseCase = new AddCommentUseCase({
            commentRepository,
            threadRepository,
        });

        // Action
        const comment = await addCommentUseCase.execute(useCasePayload);

        // Assert
        expect(comment).toStrictEqual(
            new Comment({
                id: 'comment-123',
                content: useCasePayload.content,
                owner,
            })
        );
        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload.threadId
        );
        expect(commentRepository.addComment).toBeCalledWith(
            new AddComment(useCasePayload)
        );
    });

    it('should throw error if use case payload not contain needed property', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
        };

        const commentRepository = new CommentRepository();
        const threadRepository = new ThreadRepository();

        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );
        commentRepository.addComment = jest.fn(() => Promise.resolve());

        const addCommentUseCase = new AddCommentUseCase({
            commentRepository,
            threadRepository,
        });

        // Action & Assert
        await expect(
            addCommentUseCase.execute(useCasePayload)
        ).rejects.toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload.threadId
        );
        expect(commentRepository.addComment).not.toBeCalledWith();
    });

    it('should throw error if use case payload not meet data type specification', async () => {
        // Arrange
        const useCasePayload = {
            content: 123,
            owner: 123,
            threadId: 'thread-123',
        };

        const commentRepository = new CommentRepository();
        const threadRepository = new ThreadRepository();

        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );
        commentRepository.addComment = jest.fn(() => Promise.resolve());

        const addCommentUseCase = new AddCommentUseCase({
            commentRepository,
            threadRepository,
        });

        // Action & Assert
        await expect(
            addCommentUseCase.execute(useCasePayload)
        ).rejects.toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');

        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload.threadId
        );
        expect(commentRepository.addComment).not.toBeCalledWith();
    });
});
