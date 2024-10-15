const ValidationReplyUseCase = require('../ValidationReplyUseCase');

describe('ValidationReplyUseCase', () => {
    describe('checkAvailabilityOwnerReply', () => {
        it('should throw error when user is not the owner', async () => {
            // Arrange
            const replyRepository = {
                getReplyOwnerById: jest.fn(() =>
                    Promise.resolve({ id: 'reply-123', owner: 'user-456' })
                ),
            };
            const validationReplyUseCase = new ValidationReplyUseCase({
                replyRepository,
            });

            const validation =
                validationReplyUseCase.checkAvailabilityOwnerReply(
                    'reply-123',
                    'user-123'
                );

            // Action & Assert
            await expect(validation).rejects.toThrowError(
                'VALIDATION_REPLY.NOT_THE_OWNER'
            );

            expect(replyRepository.getReplyOwnerById).toHaveBeenCalledWith(
                'reply-123'
            );
        });

        it('should not throw error when user is the owner', async () => {
            // Arrange
            const replyRepository = {
                getReplyOwnerById: jest.fn(() =>
                    Promise.resolve({ id: 'reply-123', owner: 'user-123' })
                ),
            };
            const validationReplyUseCase = new ValidationReplyUseCase({
                replyRepository,
            });

            const validation =
                validationReplyUseCase.checkAvailabilityOwnerReply(
                    'reply-123',
                    'user-123'
                );

            // Action & Assert
            await expect(validation).resolves.not.toThrowError(
                'VALIDATION_REPLY.NOT_THE_OWNER'
            );

            expect(replyRepository.getReplyOwnerById).toHaveBeenCalledWith(
                'reply-123'
            );
        });
    });
});
