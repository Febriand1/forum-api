const NewLike = require('../NewLike');

describe('NewLike entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new NewLike(payload)).toThrowError(
      'NEW_LIKE.NOT_CONTAIN_NEEDED_PARAMETER',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: 123,
      userId: 123,
    };

    // Action & Assert
    expect(() => new NewLike(payload)).toThrowError(
      'NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewLike entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action
    const like = new NewLike(payload);

    // Assert
    expect(like.threadId).toEqual(payload.threadId);
    expect(like.commentId).toEqual(payload.commentId);
    expect(like.userId).toEqual(payload.userId);
  });
});
