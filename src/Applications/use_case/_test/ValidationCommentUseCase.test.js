const ValidationCommentUseCase = require('../ValidationCommentUseCase');

describe('ValidationCommentUseCase', () => {
    describe('checkAvailabilityOwnerComment', () => {
        it('should throw error when user is not the owner', async () => {
            // Arrange
            const commentRepository = {
                getCommentOwnerById: jest.fn(() =>
                    Promise.resolve({ id: 'comment-123', owner: 'user-456' })
                ),
            };
            const validationCommentUseCase = new ValidationCommentUseCase({
                commentRepository,
            });

            const validation =
                validationCommentUseCase.checkAvailabilityOwnerComment(
                    'comment-123',
                    'user-123'
                );

            // Action & Assert
            await expect(validation).rejects.toThrowError(
                'VALIDATION_COMMENT.NOT_THE_OWNER'
            );

            expect(commentRepository.getCommentOwnerById).toHaveBeenCalledWith(
                'comment-123'
            );
        });

        it('should not throw error when user is the owner', async () => {
            // Arrange
            const commentRepository = {
                getCommentOwnerById: jest.fn(() =>
                    Promise.resolve({ id: 'comment-123', owner: 'user-123' })
                ),
            };
            const validationCommentUseCase = new ValidationCommentUseCase({
                commentRepository,
            });

            const validation =
                validationCommentUseCase.checkAvailabilityOwnerComment(
                    'comment-123',
                    'user-123'
                );

            // Action & Assert
            await expect(validation).resolves.not.toThrowError(
                'VALIDATION_COMMENT.NOT_THE_OWNER'
            );

            expect(commentRepository.getCommentOwnerById).toHaveBeenCalledWith(
                'comment-123'
            );
        });
    });
});
