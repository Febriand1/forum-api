const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-12345',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-1234',
      title: 'Super Title',
      body: 'Super Body',
      owner: 'user-12345',
      createdAt: new Date().toISOString(),
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-1234',
      content: 'Super Content',
      threadId: 'thread-1234',
      createdAt: new Date().toISOString(),
      owner: 'user-12345',
      isDelete: false,
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const newLike = new NewLike({
        threadId: 'thread-1234',
        commentId: 'comment-1234',
        userId: 'user-12345',
      });

      const fakeIdGenerator = () => '1234'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeRepositoryPostgres.addLike({
        commentId: newLike.commentId,
        userId: newLike.userId,
      });

      // Assert
      const likes = await LikesTableTestHelper.findLikesById('like-1234');

      expect(likes).toHaveLength(1);
    });

    it('should return reply correctly', async () => {
      // Arrange
      const newLike = new NewLike({
        threadId: 'thread-1234',
        commentId: 'comment-1234',
        userId: 'user-12345',
      });

      const fakeIdGenerator = () => '1234'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const like = await likeRepositoryPostgres.addLike({
        commentId: newLike.commentId,
        userId: newLike.userId,
      });

      // Assert
      expect(like).toStrictEqual('like-1234');
    });
  });

  describe('deleteLike function', () => {
    it('should delete like correctly', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-12342',
        userId: 'user-12345',
        commentId: 'comment-1234',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const result = await likeRepositoryPostgres.deleteLike({
        userId: 'user-12345',
        commentId: 'comment-1234',
      });

      expect(result).toEqual(true);

      // Assert
      const likes = await LikesTableTestHelper.findLikesById('like-12342');
      expect(likes).toHaveLength(0);
    });
  });

  describe('checkLikeAvailability function', () => {
    it('should return like when available', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-12341',
        userId: 'user-12345',
        commentId: 'comment-1234',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.checkLikeAvailability({
        userId: 'user-12345',
        commentId: 'comment-1234',
      });

      // Assert
      expect(like).toStrictEqual({
        id: 'like-12341',
      });
    });
  });

  describe('getLikesCount function', () => {
    it('should return like count correctly', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-12341',
        userId: 'user-12345',
        commentId: 'comment-1234',
      });
      await LikesTableTestHelper.addLike({
        id: 'like-12342',
        userId: 'user-12345',
        commentId: 'comment-1234',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getLikesCount(
        'comment-1234',
      );

      // Assert
      expect(likeCount).toStrictEqual({ likeCount: 2 });
    });
  });
});
