const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding1',
                    password: 'secret1',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'dicoding1',
                    password: 'secret1',
                },
            });

            const loginResponseJson = JSON.parse(loginResponse.payload);
            const accessToken = `Bearer ${loginResponseJson.data?.accessToken}`;

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'judul thread',
                    body: 'isi thread',
                },
                headers: {
                    Authorization: accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding1',
                    password: 'secret1',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'dicoding1',
                    password: 'secret1',
                },
            });

            const loginResponseJson = JSON.parse(loginResponse.payload);
            const accessToken = `Bearer ${loginResponseJson.data?.accessToken}`;

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {},
                headers: {
                    Authorization: accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
            );
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and return thread', async () => {
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding1',
                    password: 'secret1',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'dicoding1',
                    password: 'secret1',
                },
            });

            const loginResponseJson = JSON.parse(loginResponse.payload);
            const accessToken = `Bearer ${loginResponseJson.data?.accessToken}`;

            const addThreadResponse = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'judul thread',
                    body: 'isi thread',
                },
                headers: {
                    Authorization: accessToken,
                },
            });

            const addThreadResponseJson = JSON.parse(addThreadResponse.payload);

            const addCommentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${addThreadResponseJson.data.addedThread.id}/comments`,
                payload: {
                    content: 'komentar',
                },
                headers: {
                    Authorization: accessToken,
                },
            });

            const addCommentResponseJson = JSON.parse(
                addCommentResponse.payload
            );

            await server.inject({
                method: 'POST',
                url: `/threads/${addThreadResponseJson.data.addedThread.id}/comments/${addCommentResponseJson.data.addedComment.id}/replies`,
                payload: {
                    content: 'reply',
                },
                headers: {
                    Authorization: accessToken,
                },
            });

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${addThreadResponseJson.data.addedThread.id}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
        });

        it('should response 404 when thread not found', async () => {
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });
    });
});
