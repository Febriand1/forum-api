const UpdateLikeUseCase = require('../../../../Applications/use_case/UpdateLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.updateLikeHandler = this.updateLikeHandler.bind(this);
  }

  async updateLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const updateLikeUseCase = this._container.getInstance(
      UpdateLikeUseCase.name,
    );

    await updateLikeUseCase.execute({ threadId, commentId, userId });

    return h
      .response({
        status: 'success',
      })
      .code(200);
  }
}

module.exports = LikesHandler;
