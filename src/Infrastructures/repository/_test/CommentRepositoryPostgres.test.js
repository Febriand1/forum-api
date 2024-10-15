const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const Comment = require('../../../Domains/comments/entities/Comment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
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
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist add comment', async () => {
            // Arrange
            const addComment = new AddComment({
                content: 'Super Content',
                owner: 'user-1234',
                threadId: 'thread-1234',
            });
            const fakeIdGenerator = () => '1234'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            // Action
            await commentRepositoryPostgres.addComment(addComment);

            // Assert
            const comments = await CommentsTableTestHelper.findCommentsById(
                'comment-1234'
            );
            expect(comments).toHaveLength(1);
        });

        it('should return comment correctly', async () => {
            // Arrange
            const addComment = new AddComment({
                content: 'Super Content',
                owner: 'user-1234',
                threadId: 'thread-1234',
            });
            const fakeIdGenerator = () => '1234'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            // Action
            const comment = await commentRepositoryPostgres.addComment(
                addComment
            );

            // Assert
            expect(comment).toStrictEqual(
                new Comment({
                    id: 'comment-1234',
                    content: addComment.content,
                    owner: addComment.owner,
                })
            );
        });
    });

    describe('getCommentOwnerById function', () => {
        it('should return comment when available', async () => {
            // Arrange
            const date = new Date().toISOString();
            const expectedComments = {
                id: 'comment-1231',
                content: 'Super Content 1',
                isDelete: false,
                owner: 'user-1234',
                createdAt: date,
                threadId: 'thread-1234',
            };
            await CommentsTableTestHelper.addComment(expectedComments);

            // Tambahkan komentar ke tabel
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            );

            // Action
            const commentOwner =
                await commentRepositoryPostgres.getCommentOwnerById(
                    'comment-1231'
                );

            // Assert
            expect(commentOwner).toStrictEqual({
                owner: 'user-1234',
            });
        });

        it('should throw NotFoundError when comment not available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            );

            // Action & Assert
            await expect(
                commentRepositoryPostgres.getCommentOwnerById('comment-12311')
            ).rejects.toThrowError(NotFoundError);
        });
    });

    describe('deleteComment function', () => {
        it('should delete comment', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'Super Content',
                threadId: 'thread-1234',
                createdAt: new Date().toISOString(),
                owner: 'user-1234',
                isDelete: false,
            });
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool
            );

            // Action
            const result = await commentRepositoryPostgres.deleteComment(
                'comment-123'
            );

            expect(result).toEqual(true);

            // Assert
            const comments = await CommentsTableTestHelper.findCommentsById(
                'comment-123'
            );
            expect(comments).toHaveLength(1);
            expect(comments[0].is_delete).toEqual(true);
        });
    });

    describe('getCommentByThreadId function', () => {
        it('should return comments', async () => {
            // Arrange
            const threadId = 'thread-1234';
            const date = new Date().toISOString();
            const expectedComments = {
                id: 'comment-1231',
                content: 'Super Content 1',
                isDelete: false,
                owner: 'user-1234',
                createdAt: date,
                threadId,
            };

            // Tambahkan komentar ke tabel
            await CommentsTableTestHelper.addComment(expectedComments);

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            );

            // Action
            const comments =
                await commentRepositoryPostgres.getCommentByThreadId(
                    'thread-1234'
                );

            // Assert
            expect(comments).toHaveLength(1);
            expect(comments[0]).toStrictEqual({
                id: 'comment-1231',
                content: 'Super Content 1',
                date: expect.any(Date),
                is_delete: false,
                username: 'dicoding',
            });
        });
    });
});
