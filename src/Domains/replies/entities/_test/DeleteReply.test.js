const DeleteReply = require('../DeleteReply');

describe('DeleteReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_CONTAIN_NEEDED_PARAMETER',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: 123,
      replyId: 123,
      owner: 123,
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create DeleteReply entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    // Action
    const deleteReply = new DeleteReply(payload);

    // Assert
    expect(deleteReply.threadId).toEqual(payload.threadId);
    expect(deleteReply.commentId).toEqual(payload.commentId);
    expect(deleteReply.replyId).toEqual(payload.replyId);
    expect(deleteReply.owner).toEqual(payload.owner);
  });
});
