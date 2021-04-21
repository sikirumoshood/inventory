/* eslint-env mocha */
import chai from 'chai';
import sinon from 'sinon';
import ResponseHelper from '../../../app/helpers/response.helper';
import InventoryController from '../../../app/controllers/inventory.controller';
import InventoryModel from '../../../app/models/inventory.model';
import MESSAGES from '../../../app/utils/messages';

const resStub = { status () { return this }, json () {}};
const expect = chai.expect;
let sandbox: any;

describe('Unit Test: Inventory Controller', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe(':::::: Test for Add() Method ::::::', () => {
        it('Should add item successfully', async () => {
            try{
                const req = {  body: { quantity: 6, expiry: 1619269052000 }, params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = {};
                sandbox.stub(ResponseHelper, 'Success').returns(expectedResponse);
                const addStub = sandbox.stub(InventoryModel, 'add').returns(Promise.resolve(expectedResponse));
                const result = await InventoryController.add(req, res);
                expect(result).to.be.an('object');
                expect(result).to.eql(expectedResponse);
                expect(addStub.called).to.equal(true);
            }catch(e){
                throw e;
            }
        });
    
        it('Should fail to add item, expiry not in the future', async () => {
            try{
                const req = {  body: { quantity: 6, expiry: 1610000000 }, params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = MESSAGES.INVALID_EXPIRY;
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const addStub = sandbox.stub(InventoryModel, 'add').returns(Promise.resolve({}));
                const result = await InventoryController.add(req, res);
                expect(result).to.be.a('string');
                expect(result).to.equal(expectedResponse);
                expect(addStub.called).to.equal(false);
            }catch(e){
                throw e;
            }
        });
    
        it('Should fail to add item, invalid parameters', async () => {
            try{
                const req = {  body: { quantity: 0, expiry: null }, params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = MESSAGES.CANNOT_ADD_ITEM_QUANTITY;
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const addStub = sandbox.stub(InventoryModel, 'add').returns(Promise.resolve({}));
                const result = await InventoryController.add(req, res);
                expect(result).to.be.a('string');
                expect(result).to.equal(expectedResponse);
                expect(addStub.called).to.equal(false);
            }catch(e){
                throw e;
            }
        });
    
        it('Should fail to add item, quantity must be a number', async () => {
            try{
                const req = {  body: { quantity: '7', expiry: 1610000000 }, params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = MESSAGES.INVALID_EXPIRY;
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const addStub = sandbox.stub(InventoryModel, 'add').returns(Promise.resolve({}));
                const result = await InventoryController.add(req, res);
                expect(result).to.be.a('string');
                expect(result).to.equal(expectedResponse);
                expect(addStub.called).to.equal(false);
            }catch(e){
                throw e;
            }
        });
    
        it('Should fail to add item, expiry must be a number', async () => {
            try{
                const req = {  body: { quantity: 7, expiry: '1610000000' }, params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = MESSAGES.EXPIRY_NOT_A_NUMBER;
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const addStub = sandbox.stub(InventoryModel, 'add').returns(Promise.resolve({}));
                const result = await InventoryController.add(req, res);
                expect(result).to.be.a('string');
                expect(result).to.equal(expectedResponse);
                expect(addStub.called).to.equal(false);
            }catch(e){
                throw e;
            }
        });
    
        it('Should fail to add item, critical error occured', async () => {
            try{
                const req = {  body: { quantity: 7, expiry: 1619269052000 }, params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = MESSAGES.INTERNAL_ERROR;
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                sandbox.stub(InventoryModel, 'add').returns(Promise.reject('Critical Error'));
                const result = await InventoryController.add(req, res);
                expect(result).to.be.a('string');
                expect(result).to.equal(expectedResponse);
            }catch(e){
                throw e
            }
        });
        
    });

    describe(':::::: Test for Get() Method ::::::', () => {
        it('Should get the inventory quantity successfully', async () => {
            try{
                const req = { params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = { quantity: 6, validTill: 1619269052000 }
                sandbox.stub(ResponseHelper, 'Success').returns(expectedResponse);
                const getQtyOfInventoryStub = sandbox.stub(InventoryModel, 'getQtyOfInventory').returns(Promise.resolve(expectedResponse));
                const result = await InventoryController.get(req, res);
                expect(result).to.be.an('object');
                expect(result).to.eql(expectedResponse);
                expect(getQtyOfInventoryStub.called).to.equal(true);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to get item quantity, item name is not provided', async () => {
            try{
                const req = { params: { itemName: null } };
                const res = resStub;
                const expectedResponse = MESSAGES.BAD_REQUEST;
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const getQtyOfInventoryStub = sandbox.stub(InventoryModel, 'getQtyOfInventory').returns(Promise.resolve(expectedResponse));
                const result = await InventoryController.get(req, res);
                expect(result).to.be.an('string');
                expect(result).to.eql(expectedResponse);
                expect(getQtyOfInventoryStub.called).to.equal(false);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to get item quantity, critical error occured', async () => {
            try{
                const req = { params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = MESSAGES.INTERNAL_ERROR;
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                sandbox.stub(InventoryModel, 'getQtyOfInventory').returns(Promise.reject('Critical Error'));
                const result = await InventoryController.get(req, res);
                expect(result).to.be.a('string');
                expect(result).to.equal(expectedResponse);
            }catch(e){
                throw e
            }
        });
    
    });

    describe(':::::: Test for Sell() Method ::::::', () => {
        it('Should sell item quantity successfully', async () => {
            try{
                const req =  {  body: { quantity: 4 }, params: { itemName: 'shoes'} };
                const res = resStub;
                const expectedResponse = {}
                sandbox.stub(ResponseHelper, 'Success').returns(expectedResponse);
                const sellItemQtyStub = sandbox.stub(InventoryModel, 'sellItemQty').returns(Promise.resolve(expectedResponse));
                const result = await InventoryController.sell(req, res);
                expect(result).to.be.a('object');
                expect(result).to.eql(expectedResponse);
                expect(sellItemQtyStub.called).to.equal(true);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to sell item quantity', async () => {
            try{
                const req =  {  body: { quantity: '4' } };
                const res = resStub;
                const expectedResponse = MESSAGES.INVALID_QUANTITY
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const sellItemQtyStub = sandbox.stub(InventoryModel, 'sellItemQty').returns(Promise.resolve(expectedResponse));
                const result = await InventoryController.sell(req, res);
                expect(result).to.be.a('string');
                expect(result).to.eql(expectedResponse);
                expect(sellItemQtyStub.called).to.equal(false);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to sell item, quantity is zero', async () => {
            try{
                const req =  {  body: { quantity: 0 }, params: { itemName: 'shoes'} };
                const res = resStub;
                const expectedResponse = MESSAGES.ZERO_QUANTITY
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const sellItemQtyStub = sandbox.stub(InventoryModel, 'sellItemQty').returns(Promise.resolve(expectedResponse));
                const result = await InventoryController.sell(req, res);
                expect(result).to.be.a('string');
                expect(result).to.eql(expectedResponse);
                expect(sellItemQtyStub.called).to.equal(false);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to sell item, item is not provided', async () => {
            try{
                const req =  {  body: { quantity: 5 }, params: { itemName: null } };
                const res = resStub;
                const expectedResponse = MESSAGES.BAD_REQUEST
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const sellItemQtyStub = sandbox.stub(InventoryModel, 'sellItemQty').returns(Promise.resolve(expectedResponse));
                const result = await InventoryController.sell(req, res);
                expect(result).to.be.a('string');
                expect(result).to.eql(expectedResponse);
                expect(sellItemQtyStub.called).to.equal(false);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to sell item, critical error', async () => {
            try{
                const req =  {  body: { quantity: 5 }, params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = MESSAGES.INTERNAL_ERROR
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const sellItemQtyStub = sandbox.stub(InventoryModel, 'sellItemQty').returns(Promise.reject(expectedResponse));
                const result = await InventoryController.sell(req, res);
                expect(result).to.be.a('string');
                expect(result).to.eql(expectedResponse);
                expect(sellItemQtyStub.called).to.equal(true);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to sell item, quantity above stock limit', async () => {
            try{
                const req =  {  body: { quantity: 200 }, params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = MESSAGES.MAXIMUM_SALE_REACHED
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const sellItemQtyStub = sandbox.stub(InventoryModel, 'sellItemQty').returns(Promise.reject({message:'QTY_REQUESTED_ABOVE_STOCK_LIMIT'}));
                const result = await InventoryController.sell(req, res);
                expect(result).to.be.a('string');
                expect(result).to.eql(expectedResponse);
                expect(sellItemQtyStub.called).to.equal(true);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to sell item, when error is unknown', async () => {
            try{
                const req =  {  body: { quantity: 4 }, params: { itemName: 'shoes' } };
                const res = resStub;
                const expectedResponse = MESSAGES.INTERNAL_ERROR;
                sandbox.stub(ResponseHelper, 'Error').returns(expectedResponse);
                const sellItemQtyStub = sandbox.stub(InventoryModel, 'sellItemQty').returns(Promise.reject({message:'Something went wrong'}));
                const result = await InventoryController.sell(req, res);
                expect(result).to.be.a('string');
                expect(result).to.eql(expectedResponse);
                expect(sellItemQtyStub.called).to.equal(true);
            }catch(e){
                throw e;
            }
        });

    });
    
});
