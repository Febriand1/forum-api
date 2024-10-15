const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ValidationReplyUseCase = require('../ValidationReplyUseCase');

describe('DeleteReplyUseCase', () => {
    it('should throw error if use case payload not contain needed parameter', async () => {
        // Arrange
        const useCasePayload = {};

        // mock dependency
        const replyRepository = new ReplyRepository();
        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();
        const validationReplyUseCase = new ValidationReplyUseCase(
            replyRepository
        );

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve()
        );

        commentRepository.getCommentOwnerById = jest.fn(() =>
            Promise.resolve()
        );

        validationReplyUseCase.checkAvailabilityOwnerReply = jest.fn(() =>
            Promise.resolve()
        );

        replyRepository.deleteReply = jest.fn(() => Promise.resolve());

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository,
            threadRepository,
            commentRepository,
            validationReplyUseCase,
        });

        // Action & Assert
        await expect(
            deleteReplyUseCase.execute(useCasePayload)
        ).rejects.toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PARAMETER');

        expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
        expect(commentRepository.getCommentOwnerById).not.toBeCalledWith();
        expect(
            validationReplyUseCase.checkAvailabilityOwnerReply
        ).not.toBeCalledWith();
        expect(replyRepository.deleteReply).not.toBeCalledWith();
    });

    it('should throw error if use case payload not meet data type specification', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 123,
            commentId: 123,
            replyId: 123,
            owner: 123,
        };

        // mock dependency
        const replyRepository = new ReplyRepository();
        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();
        const validationReplyUseCase = new ValidationReplyUseCase(
            replyRepository
        );

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve()
        );

        commentRepository.getCommentOwnerById = jest.fn(() =>
            Promise.resolve()
        );

        validationReplyUseCase.checkAvailabilityOwnerReply = jest.fn(() =>
            Promise.resolve()
        );

        replyRepository.deleteReply = jest.fn(() => Promise.resolve());

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository,
            threadRepository,
            commentRepository,
            validationReplyUseCase,
        });

        // Action & Assert
        await expect(
            deleteReplyUseCase.execute(useCasePayload)
        ).rejects.toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');

        // Assert
        expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
        expect(commentRepository.getCommentOwnerById).not.toBeCalledWith();
        expect(
            validationReplyUseCase.checkAvailabilityOwnerReply
        ).not.toBeCalledWith();
        expect(replyRepository.deleteReply).not.toBeCalledWith();
    });

    it('should orchestrating the delete reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
            owner: 'user-123',
        };

        // mock dependency
        const replyRepository = new ReplyRepository();
        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();
        const validationReplyUseCase = new ValidationReplyUseCase(
            replyRepository
        );

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );

        commentRepository.getCommentOwnerById = jest.fn(() =>
            Promise.resolve()
        );

        validationReplyUseCase.checkAvailabilityOwnerReply = jest.fn(() =>
            Promise.resolve()
        );

        replyRepository.deleteReply = jest.fn(() => Promise.resolve(true));

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository,
            threadRepository,
            commentRepository,
            validationReplyUseCase,
        });

        // Action
        await deleteReplyUseCase.execute(useCasePayload);

        // Assert
        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload.threadId
        );
        expect(commentRepository.getCommentOwnerById).toBeCalledWith(
            useCasePayload.commentId
        );
        expect(
            validationReplyUseCase.checkAvailabilityOwnerReply
        ).toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(replyRepository.deleteReply).toBeCalledWith(
            useCasePayload.replyId
        );
    });
});
