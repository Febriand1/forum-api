const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-1111',
      username: 'dicoding11',
      password: 'secret',
      fullname: 'Dicoding11 Indonesia',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'abc',
        body: 'abc',
        owner: 'user-1111',
      });
      const fakeIdGenerator = () => '1234'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        'thread-1234',
      );
      expect(threads).toHaveLength(1);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'abc',
        body: 'abc',
        owner: 'user-1111',
      });
      const fakeIdGenerator = () => '1234'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const thread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(thread).toStrictEqual(
        new Thread({
          id: 'thread-1234',
          title: 'abc',
          owner: 'user-1111',
        }),
      );
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-1234'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return true when thread available', async () => {
      // Arrange
      const date = new Date().toISOString();
      const expectedThread = {
        id: 'thread-1234',
        title: 'Super Title',
        body: 'Super Body',
        owner: 'user-1111',
        createdAt: date,
      };

      await ThreadsTableTestHelper.addThread(expectedThread);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.verifyAvailableThread(
        'thread-1234',
      );

      // Action & Assert
      expect(thread).toBe(true);
    });
  });

  describe('getThreadById function', () => {
    it('should return thread correctly', async () => {
      // Arrange
      const date = new Date().toISOString();
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1234',
        title: 'Super Title',
        body: 'Super Body',
        owner: 'user-1111',
        createdAt: date,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(
        'thread-1234',
      );

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-1234',
        title: 'Super Title',
        body: 'Super Body',
        username: 'dicoding11',
        date: expect.any(Date),
      });
    });
  });
});
