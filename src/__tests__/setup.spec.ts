import * as ServerDetails from '../index';

const { server } = ServerDetails

before((done) => {
    console.log('Test Server is running...');
    done();
});

export default server;

