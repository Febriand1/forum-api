const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const Reply = require('../../../Domains/replies/entities/Reply');

describe('AddReplyUseCase', () => {
    it('should orchestrating the add reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'new reply',
            owner: 'user-123',
            commentId: 'comment-123',
            threadId: 'thread-123',
        };

        // mock dependency
        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();
        const replyRepository = new ReplyRepository();

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );
        commentRepository.getCommentOwnerById = jest.fn(() =>
            Promise.resolve({ owner: 'user-123' })
        );
        replyRepository.addReply = jest.fn(() =>
            Promise.resolve(
                new Reply({
                    id: 'reply-123',
                    content: useCasePayload.content,
                    owner: useCasePayload.owner,
                })
            )
        );

        // create use case instance
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository,
            threadRepository,
            commentRepository,
        });

        // Action
        const reply = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(reply).toStrictEqual(
            new Reply({
                id: 'reply-123',
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            })
        );
        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload.threadId
        );
        expect(commentRepository.getCommentOwnerById).toBeCalledWith(
            useCasePayload.commentId
        );
        expect(replyRepository.addReply).toBeCalledWith(
            new AddReply(useCasePayload)
        );
    });

    it('should throw error if use case payload not contain needed property', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
        };

        // mock dependency
        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();
        const replyRepository = new ReplyRepository();

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );
        commentRepository.getCommentOwnerById = jest.fn(() =>
            Promise.resolve()
        );
        replyRepository.addReply = jest.fn(() => Promise.resolve());

        // create use case instance
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository,
            threadRepository,
            commentRepository,
        });

        // Action & Assert
        await expect(
            addReplyUseCase.execute(useCasePayload)
        ).rejects.toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload.threadId
        );
        expect(commentRepository.getCommentOwnerById).not.toBeCalledWith();
        expect(replyRepository.addReply).not.toBeCalledWith();
    });

    it('should throw error if use case payload not meet data type specification', async () => {
        // Arrange
        const useCasePayload = {
            content: 123,
            owner: 123,
            commentId: 123,
            threadId: 123,
        };

        // mock dependency
        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();
        const replyRepository = new ReplyRepository();

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(false)
        );
        commentRepository.getCommentOwnerById = jest.fn(() =>
            Promise.resolve()
        );
        replyRepository.addReply = jest.fn(() => Promise.resolve());

        // create use case instance
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository,
            threadRepository,
            commentRepository,
        });

        // Action & Assert
        await expect(
            addReplyUseCase.execute(useCasePayload)
        ).rejects.toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');

        expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
        expect(commentRepository.getCommentOwnerById).not.toBeCalledWith();
        expect(replyRepository.addReply).not.toBeCalledWith();
    });
});
