const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const Thread = require('../../../Domains/threads/entities/Thread');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const owner = 'user-123';
        const useCasePayload = {
            title: 'Super Title',
            body: 'Super Body',
            owner,
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn(() =>
            Promise.resolve(
                new Thread({
                    id: 'thread-123',
                    title: useCasePayload.title,
                    owner,
                })
            )
        );

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(
            new Thread({
                id: 'thread-123',
                title: useCasePayload.title,
                owner,
            })
        );
        expect(mockThreadRepository.addThread).toBeCalledWith(
            new AddThread(useCasePayload)
        );
    });

    it('should throw error if use case payload not contain needed property', async () => {
        // Arrange
        const useCasePayload = {};

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn(() => Promise.resolve());

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action & Assert
        await expect(
            addThreadUseCase.execute(useCasePayload)
        ).rejects.toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

        expect(mockThreadRepository.addThread).not.toHaveBeenCalled();
    });

    it('should throw error if use case payload not meet data type specification', async () => {
        // Arrange
        const owner = 'user-123';
        const useCasePayload = {
            title: 123,
            body: 123,
            owner,
        };
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn(() => Promise.resolve());

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action & Assert
        await expect(
            addThreadUseCase.execute(useCasePayload)
        ).rejects.toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');

        expect(mockThreadRepository.addThread).not.toHaveBeenCalled();
    });
});
