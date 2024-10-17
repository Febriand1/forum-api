const ThreadId = require('../../Domains/threads/entities/ThreadId');
const CommentId = require('../../Domains/comments/entities/CommentId');
const ReplyId = require('../../Domains/replies/entities/ReplyId');

class ShowThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const threadData = await this._threadRepository.getThreadById(threadId);
    const commentsData = await this._commentRepository.getCommentByThreadId(
      threadId,
    );

    if (!threadData) {
      throw new Error('THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const thread = new ThreadId({
      id: threadData.id,
      title: threadData.title,
      body: threadData.body,
      date: threadData.date,
      username: threadData.username,
      comments: [],
    });

    for (const commentData of commentsData) {
      const likeCount = await this._likeRepository.getLikesCount(
        commentData.id,
      );
      const comment = new CommentId({
        id: commentData.id,
        username: commentData.username,
        date: commentData.date,
        replies: [],
        content: commentData.content,
        likeCount,
        isDelete: commentData.is_delete,
      });

      const repliesData = await this._replyRepository.getReplyByCommentId(
        comment.id,
      );
      for (const replyData of repliesData) {
        const reply = new ReplyId({
          id: replyData.id,
          username: replyData.username,
          date: replyData.date,
          content: replyData.content,
          isDelete: replyData.is_delete,
        });
        comment.addReply(reply);
      }

      thread.addComment(comment);
    }

    return thread;
  }
}

module.exports = ShowThreadUseCase;
