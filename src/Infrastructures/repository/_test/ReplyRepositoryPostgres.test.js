const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const Reply = require('../../../Domains/replies/entities/Reply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({
            id: 'user-1234',
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        });

        await ThreadsTableTestHelper.addThread({
            id: 'thread-1234',
            title: 'Super Title',
            body: 'Super Body',
            owner: 'user-1234',
            createdAt: new Date().toISOString(),
        });

        await CommentsTableTestHelper.addComment({
            id: 'comment-1234',
            content: 'Super Content',
            threadId: 'thread-1234',
            createdAt: new Date().toISOString(),
            owner: 'user-1234',
            isDelete: false,
        });
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addReply function', () => {
        it('should persist add comment', async () => {
            // Arrange
            const addReply = new AddReply({
                content: 'Super Content',
                owner: 'user-1234',
                commentId: 'comment-1234',
            });

            const fakeIdGenerator = () => '1234'; // stub!
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            // Action
            await replyRepositoryPostgres.addReply(addReply);

            // Assert
            const replies = await RepliesTableTestHelper.findRepliesById(
                'reply-1234'
            );
            expect(replies).toHaveLength(1);
        });

        it('should return reply correctly', async () => {
            // Arrange
            const addReply = new AddReply({
                content: 'Super Content',
                owner: 'user-1234',
                commentId: 'comment-1234',
            });

            const fakeIdGenerator = () => '1234'; // stub!
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            // Action
            const reply = await replyRepositoryPostgres.addReply(addReply);

            // Assert
            expect(reply).toStrictEqual(
                new Reply({
                    id: 'reply-1234',
                    content: addReply.content,
                    owner: addReply.owner,
                })
            );
        });
    });

    describe('getReplyOwnerById function', () => {
        it('should return owner when reply available', async () => {
            // Arrange
            await RepliesTableTestHelper.addReply({
                id: 'reply-1234',
                content: 'Super Content',
                commentId: 'comment-1234',
                createdAt: new Date().toISOString(),
                owner: 'user-1234',
                isDelete: false,
            });

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

            // Action
            const ownerReply = await replyRepositoryPostgres.getReplyOwnerById(
                'reply-1234'
            );

            // Assert
            expect(ownerReply).toStrictEqual({
                owner: 'user-1234',
            });
        });

        it('should throw NotFoundError when reply not available', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

            // Action & Assert
            await expect(
                replyRepositoryPostgres.getReplyOwnerById('reply-1234')
            ).rejects.toThrowError(NotFoundError);
        });
    });

    describe('deleteReply function', () => {
        it('should delete reply', async () => {
            // Arrange
            await RepliesTableTestHelper.addReply({
                id: 'reply-1234',
                content: 'Super Content',
                commentId: 'comment-1234',
                createdAt: new Date().toISOString(),
                owner: 'user-1234',
                isDelete: false,
            });

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

            // Action
            const result = await replyRepositoryPostgres.deleteReply(
                'reply-1234'
            );

            expect(result).toEqual(true);

            // Assert
            const replies = await RepliesTableTestHelper.findRepliesById(
                'reply-1234'
            );
            expect(replies[0].is_delete).toEqual(true);
        });
    });

    describe('getReplyByCommentId', () => {
        it('should return reply by comment id', async () => {
            const expectedReply = {
                id: 'reply-1234',
                content: 'Super Content',
                commentId: 'comment-1234',
                createdAt: new Date().toISOString(),
                owner: 'user-1234',
                isDelete: false,
            };

            await RepliesTableTestHelper.addReply(expectedReply);

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            );

            // Action
            const replies = await replyRepositoryPostgres.getReplyByCommentId(
                'comment-1234'
            );

            // Assert
            expect(replies).toHaveLength(1);
            expect(replies[0]).toStrictEqual({
                id: 'reply-1234',
                content: 'Super Content',
                date: expect.any(Date),
                username: 'dicoding',
                is_delete: false,
            });
        });
    });
});
