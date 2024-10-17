const CommentId = require('../CommentId');

describe('a CommentId entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action & Assert
    expect(() => new CommentId(payload)).toThrowError(
      'COMMENT_ID.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1234,
      content: 1234,
      username: 123,
      date: 123,
      replies: [],
    };

    // Action & Assert
    expect(() => new CommentId(payload)).toThrowError(
      'COMMENT_ID.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create Comment entities correctly with isDelete false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: new Date(),
      content: 'abc',
      isDelete: false,
    };

    // Action
    const comment = new CommentId(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
    expect(comment.replies).toEqual([]);
  });

  it('should create Comment entities correctly with isDelete true', () => {
    // Arrange
    const payload = new CommentId({
      id: 'comment-123',
      username: 'user-123',
      date: new Date(),
      content: 'abc',
      replies: [],
      isDelete: true,
    });

    const reply = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date(),
      content: 'abc',
      isDelete: true,
    };

    // Action
    const commentId = new CommentId(payload);
    commentId.addReply(reply);

    // Assert
    expect(commentId.replies).toHaveLength(1);
    expect(commentId.replies[0]).toEqual(reply);
  });
});
