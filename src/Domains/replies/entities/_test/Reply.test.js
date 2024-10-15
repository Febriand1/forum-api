const Reply = require('../Reply');

describe('a Reply entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'abc',
        };

        // Action & Assert
        expect(() => new Reply(payload)).toThrowError(
            'REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 1234,
            content: 1234,
            owner: 'user-123',
        };

        // Action & Assert
        expect(() => new Reply(payload)).toThrowError(
            'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create Reply entities correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'abc',
            owner: 'user-123',
        };

        // Action
        const reply = new Reply(payload);

        // Assert
        expect(reply.id).toEqual(payload.id);
        expect(reply.content).toEqual(payload.content);
        expect(reply.owner).toEqual(payload.owner);
    });
});
