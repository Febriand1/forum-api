const NewLike = require('../../Domains/likes/entities/NewLike');

class UpdateLikeUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const newLike = new NewLike(payload);
    await this._threadRepository.verifyAvailableThread(newLike.threadId);
    await this._commentRepository.getCommentOwnerById(newLike.commentId);
    const like = await this._likeRepository.checkLikeAvailability({
      userId: newLike.userId,
      commentId: newLike.commentId,
    });

    if (!like) {
      await this._likeRepository.addLike({
        userId: newLike.userId,
        commentId: newLike.commentId,
      });
    } else {
      await this._likeRepository.deleteLike({
        userId: newLike.userId,
        commentId: newLike.commentId,
      });
    }
  }
}

module.exports = UpdateLikeUseCase;
