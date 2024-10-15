const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 201 and persisted reply', async () => {
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
                payload: {
                    content: 'komentar',
                },
                headers: {
                    Authorization: accessToken,
                },
            });

            const commentResponseJson = JSON.parse(commentResponse.payload);
            const commentId = commentResponseJson.data.addedComment.id;

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: {
                    content: 'balasan',
                },
                headers: {
                    Authorization: accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response 200 and delete reply', async () => {
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
                payload: {
                    content: 'komentar',
                },
                headers: {
                    Authorization: accessToken,
                },
            });

            const commentResponseJson = JSON.parse(commentResponse.payload);
            const commentId = commentResponseJson.data.addedComment.id;

            const replyResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: {
                    content: 'balasan',
                },
                headers: {
                    Authorization: accessToken,
                },
            });

            const replyResponseJson = JSON.parse(replyResponse.payload);
            const replyId = replyResponseJson.data.addedReply.id;

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});
