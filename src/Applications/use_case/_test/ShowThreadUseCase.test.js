const ShowThreadUseCase = require('../ShowThreadUseCase');
const ThreadId = require('../../../Domains/threads/entities/ThreadId');
const CommentId = require('../../../Domains/comments/entities/CommentId');
const ReplyId = require('../../../Domains/replies/entities/ReplyId');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('ShowThreadUseCase', () => {
    it('should orchestrating the show thread action correctly', async () => {
        // Arrange
        const date = new Date();
        const useCasePayload = 'thread-123';

        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();
        const replyRepository = new ReplyRepository();

        // mock function
        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );
        threadRepository.getThreadById = jest.fn(() =>
            Promise.resolve({
                id: 'thread-123',
                title: 'Super Title',
                body: 'Super Body',
                username: 'dicoding',
                date,
            })
        );
        commentRepository.getCommentByThreadId = jest.fn(() => [
            {
                id: 'comment-123',
                username: 'dicoding',
                date,
                content: 'Super Comment',
                is_delete: false,
            },
        ]);
        replyRepository.getReplyByCommentId = jest.fn(() => [
            {
                id: 'reply-123',
                username: 'dicoding',
                date,
                content: 'Super Reply',
                is_delete: false,
            },
        ]);

        const showThreadUseCase = new ShowThreadUseCase({
            threadRepository,
            commentRepository,
            replyRepository,
        });

        // Action
        const thread = await showThreadUseCase.execute(useCasePayload);

        // Assert
        expect(thread).toStrictEqual(
            new ThreadId({
                id: 'thread-123',
                title: 'Super Title',
                body: 'Super Body',
                date,
                username: 'dicoding',
                comments: [
                    new CommentId({
                        id: 'comment-123',
                        username: 'dicoding',
                        date,
                        replies: [
                            new ReplyId({
                                id: 'reply-123',
                                username: 'dicoding',
                                date,
                                content: 'Super Reply',
                                isDelete: false,
                            }),
                        ],
                        content: 'Super Comment',
                        isDelete: false,
                    }),
                ],
            })
        );

        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload
        );
        expect(threadRepository.getThreadById).toBeCalledWith(useCasePayload);
        expect(commentRepository.getCommentByThreadId).toBeCalledWith(
            useCasePayload
        );
        expect(replyRepository.getReplyByCommentId).toBeCalledWith(
            'comment-123'
        );
    });

    it('should throw error if use case payload not contain needed property', async () => {
        // Arrange
        const useCasePayload = 'thread-123';

        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();
        const replyRepository = new ReplyRepository();

        threadRepository.verifyAvailableThread = jest.fn(() =>
            Promise.resolve(true)
        );
        threadRepository.getThreadById = jest.fn(() => Promise.resolve());
        commentRepository.getCommentByThreadId = jest.fn(() => []);
        replyRepository.getReplyByCommentId = jest.fn(() => []);

        const showThreadUseCase = new ShowThreadUseCase({
            threadRepository,
            commentRepository,
            replyRepository,
        });

        // Action & Assert
        await expect(
            showThreadUseCase.execute(useCasePayload)
        ).rejects.toThrowError('THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY');

        expect(threadRepository.verifyAvailableThread).toBeCalledWith(
            useCasePayload
        );
        expect(threadRepository.getThreadById).not.toBeCalledWith();
        expect(commentRepository.getCommentByThreadId).not.toBeCalledWith();
        expect(replyRepository.getReplyByCommentId).not.toBeCalledWith();
    });
});
