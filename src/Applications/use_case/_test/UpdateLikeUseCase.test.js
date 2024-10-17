const UpdateLikeUseCase = require('../UpdateLikeUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('UpdateLikeUseCase', () => {
  it('should orchestrating the update like action correctly when not like yet', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // mock dependency
    const commentRepository = new CommentRepository();
    const threadRepository = new ThreadRepository();
    const likeRepository = new LikeRepository();

    // mock function
    threadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve(true),
    );

    commentRepository.getCommentOwnerById = jest.fn(() =>
      Promise.resolve({ owner: 'user-1231' }),
    );

    likeRepository.checkLikeAvailability = jest.fn(() =>
      Promise.resolve(undefined),
    );

    likeRepository.deleteLike = jest.fn(() => Promise.resolve(false));

    likeRepository.addLike = jest.fn(() =>
      Promise.resolve({
        id: 'like-123',
      }),
    );

    // create use case instance
    const updateLikeUseCase = new UpdateLikeUseCase({
      likeRepository,
      commentRepository,
      threadRepository,
    });

    // Action
    await updateLikeUseCase.execute(useCasePayload);

    // Assert
    expect(threadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(commentRepository.getCommentOwnerById).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(likeRepository.checkLikeAvailability).toBeCalledWith({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
    });
    expect(likeRepository.deleteLike).not.toBeCalledWith();
    expect(likeRepository.addLike).toBeCalledWith({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
    });
  });

  it('should orchestrating the update like action correctly when already like', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // mock dependency
    const commentRepository = new CommentRepository();
    const threadRepository = new ThreadRepository();
    const likeRepository = new LikeRepository();

    // mock function
    threadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve(true),
    );

    commentRepository.getCommentOwnerById = jest.fn(() =>
      Promise.resolve({ owner: 'user-1231' }),
    );

    likeRepository.checkLikeAvailability = jest.fn(() =>
      Promise.resolve({
        id: 'like-123',
      }),
    );

    likeRepository.deleteLike = jest.fn(() => Promise.resolve(true));

    likeRepository.addLike = jest.fn(() => Promise.resolve());

    // create use case instance
    const updateLikeUseCase = new UpdateLikeUseCase({
      likeRepository,
      commentRepository,
      threadRepository,
    });

    // Action
    await updateLikeUseCase.execute(useCasePayload);

    // Assert
    expect(threadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(commentRepository.getCommentOwnerById).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(likeRepository.checkLikeAvailability).toBeCalledWith({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
    });
    expect(likeRepository.deleteLike).toBeCalledWith({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
    });
    expect(likeRepository.addLike).not.toBeCalledWith();
  });

  it('should throw error if use case payload not contain needed parameter', async () => {
    // Arrange
    const useCasePayload = {};

    // mock dependency
    const commentRepository = new CommentRepository();
    const threadRepository = new ThreadRepository();
    const likeRepository = new LikeRepository();

    threadRepository.verifyAvailableThread = jest.fn();

    commentRepository.getCommentOwnerById = jest.fn();

    likeRepository.checkLikeAvailability = jest.fn();

    likeRepository.deleteLike = jest.fn();

    likeRepository.addLike = jest.fn();

    // create use case instance
    const updateLikeUseCase = new UpdateLikeUseCase({
      likeRepository,
      commentRepository,
      threadRepository,
    });

    // Action & Assert
    await expect(
      updateLikeUseCase.execute(useCasePayload),
    ).rejects.toThrowError('NEW_LIKE.NOT_CONTAIN_NEEDED_PARAMETER');

    expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
    expect(commentRepository.getCommentOwnerById).not.toBeCalledWith();
    expect(likeRepository.checkLikeAvailability).not.toBeCalledWith();
    expect(likeRepository.deleteLike).not.toBeCalledWith();
    expect(likeRepository.addLike).not.toBeCalledWith();
  });

  it('should thorw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
      commentId: 123,
      userId: 123,
    };

    // mock dependency
    const commentRepository = new CommentRepository();
    const threadRepository = new ThreadRepository();
    const likeRepository = new LikeRepository();

    threadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve(false),
    );

    commentRepository.getCommentOwnerById = jest.fn(() => Promise.resolve());

    likeRepository.checkLikeAvailability = jest.fn(() => Promise.resolve());

    likeRepository.deleteLike = jest.fn(() => Promise.resolve(false));

    likeRepository.addLike = jest.fn(() => Promise.resolve());

    // create use case instance
    const updateLikeUseCase = new UpdateLikeUseCase({
      likeRepository,
      commentRepository,
      threadRepository,
    });

    // Action & Assert
    await expect(
      updateLikeUseCase.execute(useCasePayload),
    ).rejects.toThrowError('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(threadRepository.verifyAvailableThread).not.toBeCalledWith();
    expect(commentRepository.getCommentOwnerById).not.toBeCalledWith();
    expect(likeRepository.checkLikeAvailability).not.toBeCalledWith();
    expect(likeRepository.deleteLike).not.toBeCalledWith();
    expect(likeRepository.addLike).not.toBeCalledWith();
  });
});
