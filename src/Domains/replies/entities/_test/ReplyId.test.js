const ReplyId = require('../ReplyId');

describe('a ReplyId entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action & Assert
    expect(() => new ReplyId(payload)).toThrowError(
      'REPLY_ID.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1234,
      content: 1234,
      username: 123,
      date: 123,
    };

    // Action & Assert
    expect(() => new ReplyId(payload)).toThrowError(
      'REPLY_ID.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create Reply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date(),
      content: 'abc45',
      isDelete: false,
    };

    // Action
    const reply = new ReplyId(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.date);
    expect(reply.content).toEqual(payload.content);
  });

  it('should create Reply entities correctly with isDelete', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date(),
      content: 'abc45',
      isDelete: true,
    };

    // Action
    const reply = new ReplyId(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.date);
    expect(reply.content).toEqual('**balasan telah dihapus**');
  });
});
