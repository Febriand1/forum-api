const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain needed parameter', async () => {
    // Arrange
    const useCasePayload = {};

    // mock dependency
    const replyRepository = new ReplyRepository();
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();

    // mock function
    threadRepository.verifyAvailableThread = jest.fn();
    commentRepository.getCommentOwnerById = jest.fn();
    replyRepository.getReplyOwnerById = jest.fn();
    replyRepository.deleteReply = jest.fn();

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository,
      threadRepository,
      commentRepository,
    });

    // Action & Assert
    await expect(
      deleteReplyUseCase.execute(useCasePayload),
    ).rejects.toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PARAMETER');

    expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
    expect(commentRepository.getCommentOwnerById).not.toBeCalledWith();
    expect(replyRepository.getReplyOwnerById).not.toBeCalledWith();
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

    // mock function
    threadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve(false),
    );

    commentRepository.getCommentOwnerById = jest.fn(() => Promise.resolve());

    replyRepository.getReplyOwnerById = jest.fn(() => Promise.resolve());

    replyRepository.deleteReply = jest.fn(() => Promise.resolve(false));

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository,
      threadRepository,
      commentRepository,
    });

    // Action & Assert
    await expect(
      deleteReplyUseCase.execute(useCasePayload),
    ).rejects.toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');

    // Assert
    expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
    expect(commentRepository.getCommentOwnerById).not.toBeCalledWith();
    expect(replyRepository.getReplyOwnerById).not.toBeCalledWith();
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

    // mock function
    threadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve(true),
    );

    commentRepository.getCommentOwnerById = jest.fn(() => Promise.resolve());

    replyRepository.getReplyOwnerById = jest.fn(() =>
      Promise.resolve({
        id: 'reply-123',
        owner: 'user-123',
      }),
    );

    replyRepository.deleteReply = jest.fn(() => Promise.resolve(true));

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository,
      threadRepository,
      commentRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(threadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(commentRepository.getCommentOwnerById).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(replyRepository.getReplyOwnerById).toBeCalledWith(
      useCasePayload.replyId,
    );
    expect(replyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
  });

  it('should throw error when user is not the owner', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };
    const replyRepository = new ReplyRepository();
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();

    // mock function
    threadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve(true),
    );

    commentRepository.getCommentOwnerById = jest.fn(() => Promise.resolve());

    replyRepository.getReplyOwnerById = jest.fn(() =>
      Promise.resolve({
        id: 'reply-123',
        owner: 'user-456',
      }),
    );

    replyRepository.deleteReply = jest.fn(() => Promise.resolve(true));

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository,
      threadRepository,
      commentRepository,
    });

    await expect(
      deleteReplyUseCase.execute(useCasePayload),
    ).rejects.toThrowError('VALIDATION_REPLY.NOT_THE_OWNER');

    // Assert
    expect(threadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(commentRepository.getCommentOwnerById).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(replyRepository.getReplyOwnerById).toBeCalledWith(
      useCasePayload.replyId,
    );
    expect(replyRepository.deleteReply).not.toBeCalledWith();
  });
});
