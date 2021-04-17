import server from './setup.spec';

after((done) => {
    console.log('Shutting down test server...')
    server.close(done);
});
