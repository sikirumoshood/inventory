import logger from '../../config/logger';
import db from '../database';
import query from '../queries/inventory'
import { Item, ItemWithId, QuantityResult, Empty, SellRequestData } from '../types/intenvory.types'
import ERRORS_TYPES from '../utils/error.types';

/**
 * @description This class is responsible for peforming CRUD operations
 * on the inventory table.
 * 
 */

class InventoryModel {
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

    static async addQtyForExistingItem (data: ItemWithId) : Promise<any> {
        try{

                const { id: itemId, expiry, quantity } = data;
                await db.none(query.addInventory, [ itemId, quantity, expiry ]);

            return true;
        }catch(e){
            logger.error(`EX::InventoryModel::AddQtyForExistingItem:: Failed to add quantity for existing item - [${data.id}] - [${data.quantity}]`, e.message);
            throw(e)
        }
    }

    static async addQtyForNewItem (data: Item) : Promise<any> {
        try{
            await db.tx(async (t:any) => {
                const { itemName, expiry, quantity } = data;
                const item = await t.one(query.addNewItem, [ itemName ]);
                await t.none(query.addInventory, [ item.id, quantity, expiry ]);
            });

            return true;
        }catch(e){
            logger.error(`EX::InventoryModel::AddQtyForNewItem:: Failed to add new item details - [${data.itemName}] - [${data.quantity}] `, e.message);
            throw(e)
        }
    }

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

    static async sellItemQty (data: SellRequestData) : Promise<Empty> {
        try{
            const { quantity: qtyToSell, itemName } = data;
            logger.info(`Processing sell request - item [${itemName}] - qty [${qtyToSell}]...`)
            await db.tx(async (t:any) : Promise<any> => {
                const availableItems = await t.any(query.getAllAvailableItems, [itemName]);
                const qtyOfAvailableItems = availableItems.reduce((acc: number, curr: any) => Number(curr.quantity) + acc , 0);
                
                if(qtyToSell > qtyOfAvailableItems) {
                    logger.error(`Quantity of [${itemName}] requested is above the available items - [${qtyOfAvailableItems}]`);
                    throw new Error(ERRORS_TYPES.SELL_REQUEST_ABOVE_LIMIT);
                }
                
                const promises = [];
                let qtyToSellCopy = qtyToSell;
                for(const item of availableItems){
                    let currentQty:number = Number(item.quantity);
                    if(qtyToSellCopy === 0) break;
                    if(currentQty === 0) continue;
                    if(qtyToSellCopy > currentQty){
                        qtyToSellCopy -= currentQty;
                        currentQty = 0;
                    }else{
                        currentQty -= qtyToSellCopy;
                        qtyToSellCopy = 0;
                        
                    }
                    promises.push(t.none(query.updateItemQty, [ currentQty, item.inventory_id ]))
                }

                return t.batch(promises);
            } );

            return {}
            
        }catch(e){
            logger.error(`EX::InventoryModel::SellItemQty:: Failed to process sell request - [${data.itemName}] -  [${data.quantity}] `, e.message);
            throw(e)
        }
    }

}

export default InventoryModel;
