const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(addLike) {
    const { userId, commentId } = addLike;
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async deleteLike({ userId, commentId }) {
    const query = {
      text: 'DELETE FROM likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);

    return true;
  }

  async checkLikeAvailability({ userId, commentId }) {
    const query = {
      text: 'SELECT id FROM likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getLikesCount(commentId) {
    const query = {
      text: 'SELECT COUNT(likes.comment_id) AS likes FROM likes WHERE likes.comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    const likeCount = parseInt(result.rows[0].likes, 10);

    return likeCount;
  }
}

module.exports = LikeRepositoryPostgres;
