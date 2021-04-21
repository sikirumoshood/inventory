import request from 'request-promise-native';
import chai from 'chai';
import { Empty } from '../../app/types/intenvory.types';
import MESSAGES from '../../app/utils/messages';

const expect = chai.expect;
const PORT = process.env.PORT;
const BASE_URL = `http://localhost:${PORT}`;

describe('Integration Test For Inventory Routes', () => {
    it('Should add new items successfully', async () => {
        try {
            const expectedResponse: Empty = {};     
            const response = await request({ method: 'POST', uri: `${BASE_URL}/shoes/add`, json: true, body: {
                "quantity": 20,
                "expiry": 1619269052000
            } })

            expect(response).to.eql(expectedResponse);

        }catch(e) {
            throw (e)
        }
    });

    it('Should get the correct quantity of item successfully', async () => {
        try {    
            const response = await request({ method: 'GET', uri: `${BASE_URL}/shoes/quantity`, json: true })
            const expectedResponse = {
                quantity: 20,
                validTill: 1619269052000
            };
            expect(response).to.eql(expectedResponse);

        }catch(e) {
            throw (e)
        }
    });

    it('Should sell the correct quantity of item successfully', async () => {
        try {    
            const response = await request({ method: 'POST', uri: `${BASE_URL}/shoes/sell`, json: true, body: {quantity: 10}})
            const expectedResponse: Empty = {}
            expect(response).to.eql(expectedResponse);
        }catch(e) {
            throw (e)
        }
    });

    it('Should fail to sell because item requested is above the stock limit', async () => {
        try {    
            await  request({ method: 'POST', uri: `${BASE_URL}/shoes/sell`, json: true, body: {quantity: 20}})
        }catch(e) {
            const expectedResponse = { msg: MESSAGES.MAXIMUM_SALE_REACHED };
            expect(JSON.parse(e.message.split('-')[1])).to.eql(expectedResponse);

        }
    });
});