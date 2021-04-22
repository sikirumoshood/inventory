/* eslint-env mocha */
import chai from 'chai';
import sinon from 'sinon';
import db from '../../../app/database';
import InventoryModel from '../../../app/models/inventory.model';
import { Empty, Item, ItemWithId, SellRequestData } from '../../../app/types/intenvory.types';

const expect = chai.expect;
let sandbox: any;

describe('Unit Test: Inventory Model', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe(':::::: Test for Add() Method ::::::', () => {
        it('Should add item as new item successfully', async () => {
            try{
                const data: Item = { itemName: 'shoes', quantity: 5, expiry: 1619269052000 };
                const expectedResponse = {};
                const findItemByNameStub = sandbox.stub(InventoryModel, 'findItemByName').returns(Promise.resolve(null));
                const addQtyForExistingItemSub = sandbox.stub(InventoryModel, 'addQtyForExistingItem');
                const addQtyForNewItem = sandbox.stub(InventoryModel, 'addQtyForNewItem').returns(Promise.resolve(true));
                const result = await InventoryModel.add(data);
                expect(result).to.be.an('object');
                expect(result).to.eql(expectedResponse);
                expect(findItemByNameStub.called).to.equal(true);
                expect(addQtyForExistingItemSub.called).to.equal(false);
                expect(addQtyForNewItem.called).to.equal(true);
            }catch(e){
                throw e;
            }
        });

        it('Should add item quantity to existing item successfully', async () => {
            try{
                const data: Item = { itemName: 'shoes', quantity: 5, expiry: 1619269052000 };
                const expectedResponse = {};
                const findItemByNameStub = sandbox.stub(InventoryModel, 'findItemByName').returns(Promise.resolve({ id: 1 }));
                const addQtyForExistingItemSub = sandbox.stub(InventoryModel, 'addQtyForExistingItem').returns(Promise.resolve(true));
                const addQtyForNewItem = sandbox.stub(InventoryModel, 'addQtyForNewItem');
                const result = await InventoryModel.add(data);
                expect(result).to.be.an('object');
                expect(result).to.eql(expectedResponse);
                expect(findItemByNameStub.called).to.equal(true);
                expect(addQtyForExistingItemSub.called).to.equal(true);
                expect(addQtyForNewItem.called).to.equal(false);
            }catch(e){
                throw e;
            }
        });


        it('Should add item when an error occurs', async () => {
            try{
                const data: Item = { itemName: 'shoes', quantity: 5, expiry: 1619269052000 };
                sandbox.stub(InventoryModel, 'findItemByName').returns(Promise.resolve({ id: 1 }));
                sandbox.stub(InventoryModel, 'addQtyForExistingItem').returns(Promise.reject({message: 'Database is down'}));
                await InventoryModel.add(data);
            }catch(e){
                const expectedResponse = 'Database is down'
                expect(e.message).to.equal(expectedResponse);
            }
        });

    });
    
    describe(':::::: Test for AddQtyForExistingItem() Method ::::::', () => {
        it('Should add items successfully', async () => {
            try{
                const data: ItemWithId = { itemName: 'shoes', quantity: 5, expiry: 1619269052000 , id: '1'};
                const expectedResponse:boolean = true;
                sandbox.stub(db, 'tx').callsFake ( async (callback:any) => {
                    const t = {
                        none () {
                            return {}
                        },

                        batch () {
                            return []
                        }
                    }
                   await callback(t)
                })
                const result = await InventoryModel.addQtyForExistingItem(data);
                expect(result).to.be.a('boolean');
                expect(result).to.eql(expectedResponse);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to add items due to database error', async () => {
            try{
                const data: ItemWithId = { itemName: 'shoes', quantity: 5, expiry: 1619269052000 , id: '1'};
                sandbox.stub(db, 'tx').returns(Promise.reject({message:'Connection Lost'}))
                await InventoryModel.addQtyForExistingItem(data);
            }catch(e){
                const expectedResponse = 'Connection Lost';
                expect(e).to.be.a('object');
                expect(e.message).to.eql(expectedResponse);
            }
        });
    });

    describe(':::::: Test for AddQtyForNewItem() Method ::::::', () => {
        it('Should add new items successfully', async () => {
            try{
                const data: Item = { itemName: 'shoes', quantity: 5, expiry: 1619269052000 };
                const expectedResponse:boolean = true;

                sandbox.stub(db, 'tx').callsFake( async (callback:any) => {
                    const t = {
                        one () { return { id: 1 }},
                        none () { return null },
                        async batch () { return [] }
                    }
                    await callback(t)
                } );

                const result = await InventoryModel.addQtyForNewItem(data);
                expect(result).to.be.a('boolean');
                expect(result).to.eql(expectedResponse);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to add new item, item was not created', async () => {
            try{
                const data: Item = { itemName: 'shoes', quantity: 5, expiry: 1619269052000 };
                sandbox.stub(db, 'tx').callsFake( async (callback:any) => {
                    const t = {
                        one () { return null },
                        none () { return null },
                        async batch () { return [] }
                    }
                    await callback(t)
                } );

                await InventoryModel.addQtyForNewItem(data);
            }catch(e){
                const expectedResponse = 'All attempts failed to create this item - [shoes]'
                expect(e.message).to.eql(expectedResponse);
            }
        });

        it('Should fail to add new items due to database error', async () => {
            try{
                const data: ItemWithId = { itemName: 'shoes', quantity: 5, expiry: 1619269052000 , id: '1'};
                sandbox.stub(db, 'tx').returns(Promise.reject({message:'Connection Lost'}))
                await InventoryModel.addQtyForNewItem(data);
            }catch(e){
                const expectedResponse = 'Connection Lost';
                expect(e).to.be.an('object');
                expect(e.message).to.eql(expectedResponse);
            }
        });

    });

    describe(':::::: Test for FindItemByName() Method ::::::', () => {
        it('Should return item with the correct name', async () => {
            try{
                const data: string = 'shoes' ;
                const expectedResponse: Empty = {};
                sandbox.stub(db, 'oneOrNone').returns(Promise.resolve({}))
                const result = await InventoryModel.findItemByName(data);
                expect(result).to.be.an('object');
                expect(result).to.eql(expectedResponse);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to fetch item, database due to error', async () => {
            try{
                const itemName: string = 'shoes' ;
                sandbox.stub(db, 'oneOrNone').returns(Promise.reject({message: 'Connection Lost'}))
                await InventoryModel.findItemByName(itemName);
            }catch(e){
                const expectedResponse = 'Connection Lost';
                expect(e).to.be.an('object');
                expect(e.message).to.eql(expectedResponse);
            }
        });

    });

    describe(':::::: Test for GetQtyOfInventory() Method ::::::', () => {
        it('Should return the current quantity of the supplied item', async () => {
            try{
                const itemName: string = 'shoes' ;
                const expectedResponse:object = {
                    quantity: 20,
                    validTill: 1619269052000
                }
                const oneOrNoneStub = sandbox.stub(db, 'oneOrNone');
                oneOrNoneStub.onCall(0).returns(Promise.resolve({id: 1044}));
                oneOrNoneStub.onCall(1).returns(Promise.resolve({quantity: 20}));
                oneOrNoneStub.onCall(2).returns(Promise.resolve({valid_till: '1619269052000'}));
                const result = await InventoryModel.getQtyOfInventory(itemName);
                expect(result).to.be.an('object');
                expect(result).to.eql(expectedResponse);
            }catch(e){
                throw e;
            }
        });

        it('Should return zero, item not found', async () => {
            try{
                const data: string = 'doesNotExist' ;
                const expectedResponse:object = {
                    quantity: 0,
                    validTill: null
                }
                sandbox.stub(db, 'oneOrNone').returns(Promise.resolve(null))
                const result = await InventoryModel.getQtyOfInventory(data);
                expect(result).to.be.an('object');
                expect(result).to.eql(expectedResponse);
            }catch(e){
                throw e
            }
        });

        it('Should fail to get item due to database error', async () => {
            try{
                const itemName: string = 'shoes';
                sandbox.stub(db, 'oneOrNone').returns(Promise.reject({ message: 'Connection Lost'}));
                await InventoryModel.getQtyOfInventory(itemName);
                
            }catch(e){
                const expectedResponse = 'Connection Lost';
                expect(e).to.be.an('object');
                expect(e.message).to.eql(expectedResponse);
            }
        });

    });

    describe(':::::: Test for SellItemQty() Method ::::::', () => {
        it('Should sell the requested item successfully', async () => {
            try{
                const data: SellRequestData = { quantity: 10, itemName: 'shoes'} ;
                const expectedResponse: Empty = {};
                const oneOrNoneStub = sandbox.stub(db, 'oneOrNone');
                oneOrNoneStub.onCall(0).returns(Promise.resolve({ id: 10044}));
                oneOrNoneStub.onCall(1).returns(Promise.resolve({}));
                const result = await InventoryModel.sellItemQty(data);
                expect(result).to.be.an('object');
                expect(result).to.eql(expectedResponse);
            }catch(e){
                throw e;
            }
        });

        it('Should fail to sell item due to database error', async () => {
            try{
                const data: SellRequestData = { quantity: 10, itemName: 'shoes'};
                sandbox.stub(db, 'oneOrNone').returns(Promise.reject({ message: 'Connection Lost'}));
                await InventoryModel.sellItemQty(data);
                
            }catch(e){
                const expectedResponse = 'Connection Lost';
                expect(e).to.be.an('object');
                expect(e.message).to.eql(expectedResponse);
            }
        });
    });
    
});
