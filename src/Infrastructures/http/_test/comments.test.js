const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted comment', async () => {
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
            const threadResponse = await server.inject({
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

            const threadResponseJson = JSON.parse(threadResponse.payload);
            const threadId = threadResponseJson.data.addedThread.id;

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: { content: 'isi komentar' },
                headers: {
                    Authorization: accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
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
            const threadResponse = await server.inject({
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

            const threadResponseJson = JSON.parse(threadResponse.payload);
            const threadId = threadResponseJson.data.addedThread.id;

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
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
                'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'
            );
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 and delete comment', async () => {
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
            const threadResponse = await server.inject({
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

            const threadResponseJson = JSON.parse(threadResponse.payload);
            const threadId = threadResponseJson.data.addedThread.id;

            const commentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: { content: 'isi komentar' },
                headers: {
                    Authorization: accessToken,
                },
            });

            const commentResponseJson = JSON.parse(commentResponse.payload);
            const commentId = commentResponseJson.data.addedComment.id;

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 404 when comment not found', async () => {
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
            const threadResponse = await server.inject({
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

            const threadResponseJson = JSON.parse(threadResponse.payload);
            const threadId = threadResponseJson.data.addedThread.id;

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/1`,
                headers: {
                    Authorization: accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('comment tidak ditemukan');
        });
    });
});
