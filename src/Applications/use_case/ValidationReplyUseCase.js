class ValidationReplyUseCase {
    constructor({ replyRepository }) {
        this._replyRepository = replyRepository;
    }

    async checkAvailabilityOwnerReply(replyId, owner) {
        const reply = await this._replyRepository.getReplyOwnerById(replyId);

        if (reply.owner !== owner) {
            throw new Error('VALIDATION_REPLY.NOT_THE_OWNER');
        }
    }
}

module.exports = ValidationReplyUseCase;
