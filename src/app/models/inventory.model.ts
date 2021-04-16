import logger from '../../config/logger';
import db from '../database';
import query from '../queries/inventory'
import { Item, ItemWithId, QuantityResult, Empty, SellRequestData } from '../types/intenvory.types'

class InventoryModel {
    /***
     * @description Saves a new item into the inventrories table
     * @param {Item} data 
     * @returns {Empty}
     */
    static async add (data: Item) : Promise<Empty> {
        try{
            const { itemName } = data;
            const existingItemType = await InventoryModel.findItemByName(itemName);

            if(existingItemType){
                logger.info(`Adding quantity for existing item - [${itemName}] `)
                await InventoryModel.addQtyForExistingItem({ id: existingItemType.id, ...data })
                logger.info(`Quantity - [${data.quantity}] added for existing item - [${itemName}] successfully`)
            }else{
                logger.info(`Adding quantity for new item - [${itemName}] `)
                await InventoryModel.addQtyForNewItem(data)
                logger.info(`Quantity - [${data.quantity}] added for new item - [${itemName}] successfully`)
            }

            return {}
        }catch(e){
            logger.error(`EX::InventoryModel::Add:: Failed to add invetontory details - [${data.itemName}] - [${data.quantity}]`, e.message);
            throw(e)
        }
    }


    /***
     * @description Adds only the suplied quantity of items to the inventories table
     * when the inventory type already exists in the database
     * @param {ItemWithId} data 
     * @returns {boolean}
     */
    static async addQtyForExistingItem (data: ItemWithId) : Promise<any> {
        try{

                const { id: itemId, expiry, quantity } = data;
                await db.tx(async (t:any) => {
                    const queries = [];
                    for(let q = 1; q <= quantity; ++q){
                        queries.push(t.none(query.addInventory, [ itemId, 1, expiry ]));
                    }
                    await t.batch(queries);
                })
            
            return true;
        }catch(e){
            logger.error(`EX::InventoryModel::AddQtyForExistingItem:: Failed to add quantity for existing item - [${data.id}] - [${data.quantity}]`, e.message);
            throw(e)
        }
    }

    /**
     * @description Adds a new item and its quantity. This is called when we know the item has
     * never been created. Item has never been in stock
     * @param {Item} data 
     * @returns {boolean}
     */
    static async addQtyForNewItem (data: Item) : Promise<any> {
        try{
            await db.tx(async (t:any) => {
                const { itemName, expiry, quantity } = data;
                let item = null;
               
                item = await t.one(query.addNewItem, [ itemName ]);
        
                if(!item){
                    throw new Error(`All attempts failed to create this item - [${itemName}]`);
                }

                const queries = [];
                for(let q = 1; q <= quantity; ++q){
                    queries.push(t.none(query.addInventory, [ item.id, 1, expiry ]));
                }
                
                await t.batch(queries);
            });

            return true;
        }catch(e){
            logger.error(`EX::InventoryModel::AddQtyForNewItem:: Failed to add new item details - [${data.itemName}] - [${data.quantity}] `, e.message);
            throw(e)
        }
    }

    /**
     * @description Finds and item with the supplied name
     * @param {string} name 
     * @returns {Object} item
     */
    static async findItemByName (name: string) : Promise<any> {
        try{
            let item = null;
            item = await db.oneOrNone(query.getItemByName, [ name ]);
            return item;
        }catch(e){
            logger.error(`EX::InventoryModel::FindItemByName:: Failed to fetch with the name - [${name}] `, e.message);
            throw (e)
        }
    } 


    /**
     * @description Fetches the quantity of item remaining in the database
     * as of the time of call
     * @param {string} itemName
     * @returns {QuantityResult}
     */
    static async getQtyOfInventory (itemName:string) : Promise<QuantityResult> {
        try{

            const result = await db.oneOrNone(query.getInventoryQuantity, [ itemName ]);
            if(!result || result.quantity === null || (result.quantity && result.quantity == 0) || result.valid_till === null){
                return { quantity:0 , validTill: null }
            }

            result.quantity = Number(result.quantity);
            result.validTill = Number(result.valid_till);
            delete result.valid_till;
            return result;
            
        }catch(e){
            logger.error(`EX::InventoryModel::GetQtyOfInventory:: Failed to fetch inventory quantity - [${itemName}] `, e.message);
            throw(e)
        }
    }

    /**
     * @description This sells out a certain quantity of item by reducing its entry in the database
     * @param {SellRequestData} data 
     * @returns {Empty}
     */
    static async sellItemQty (data: SellRequestData) : Promise<Empty> {
        try{
            const { quantity: qtyToSell, itemName } = data;
            logger.info(`Processing sell request - item [${itemName}] - qty [${qtyToSell}]...`)
            // Sell items and remove from stock
            await db.oneOrNone(query.sellItems, [itemName, qtyToSell]);
            logger.info(`Successfully sold - item [${itemName}] - qty [${qtyToSell}]...`)
            return {}
            
        }catch(e){
            logger.error(`EX::InventoryModel::SellItemQty:: Failed to process sell request - [${data.itemName}] -  [${data.quantity}] `, e.message);
            throw(e)
        }
    }

}

export default InventoryModel;
