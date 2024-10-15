const ThreadId = require('../ThreadId');

describe('ThreadId entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'abc',
        };

        // Action & Assert
        expect(() => new ThreadId(payload)).toThrowError(
            'THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'abc',
            body: 123,
            username: 1234,
            date: '123',
            comments: [],
        };

        // Action & Assert
        expect(() => new ThreadId(payload)).toThrowError(
            'THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create Thread entities correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'abc',
            body: 'abc',
            username: 'user-123',
            date: new Date(),
        };

        // Action
        const thread = new ThreadId(payload);

        // Assert
        expect(thread.id).toEqual(payload.id);
        expect(thread.title).toEqual(payload.title);
        expect(thread.body).toEqual(payload.body);
        expect(thread.date).toEqual(payload.date);
        expect(thread.username).toEqual(payload.username);
        expect(thread.comments).toEqual([]);
    });

    it('should create Thread entities with comments correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'abc',
            body: 'abc',
            username: 'user-123',
            date: new Date(),
            comments: [
                {
                    id: 'comment-123',
                    username: 'user-123',
                    date: new Date(),
                    content: 'abc',
                    replies: [],
                },
            ],
        };

        // Action
        const thread = new ThreadId(payload);

        // Assert
        expect(thread.id).toEqual(payload.id);
        expect(thread.title).toEqual(payload.title);
        expect(thread.body).toEqual(payload.body);
        expect(thread.date).toEqual(payload.date);
        expect(thread.username).toEqual(payload.username);
        expect(thread.comments).toEqual(payload.comments);
    });

    it('should create Thread entities with comments', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'abc',
            body: 'abc',
            username: 'user-123',
            date: new Date(),
            comments: [],
        };

        const comment = {
            id: 'comment-123',
            username: 'user-123',
            date: new Date(),
            content: 'abc',
        };

        // Action
        const threadId = new ThreadId(payload);
        threadId.addComment(comment);

        // Assert
        expect(threadId.comments).toHaveLength(1);
        expect(threadId.comments[0]).toEqual(comment);
    });
});
