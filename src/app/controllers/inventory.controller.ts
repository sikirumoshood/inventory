import logger from "../../config/logger";
import ResponseHelper from "../helpers/response.helper";
import ValidationHelper from "../helpers/validation.helper";
import InventoryModel from "../models/inventory.model";
import MESSAGES from '../utils/messages';
import ErrorUtils from "../utils/error.util";

class InventoryController {
    /***
     * @description Adds adds a new item to the inventories table.
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Object}
     */
    static async add (req: any, res: any) : Promise<any> {
        try{
            logger.info('Incoming request inventory.controller.ts');
            const { expiry = null, quantity = null } = req.body;
            const { itemName } = req.params

            if(!expiry || !quantity || !itemName) {
                return ResponseHelper.Error(res, MESSAGES.CANNOT_ADD_ITEM_QUANTITY)
            }

            if(!ValidationHelper.isNumber(expiry)) {
                return ResponseHelper.Error(res, MESSAGES.EXPIRY_NOT_A_NUMBER)
            }

            if(!ValidationHelper.isNumber(quantity)) {
                return ResponseHelper.Error(res, MESSAGES.INVALID_QUANTITY)
            }

            if(!ValidationHelper.epochInFuture(Number(expiry))){
                return ResponseHelper.Error(res, MESSAGES.INVALID_EXPIRY)
            }

            req.body.itemName = itemName;
            const result = await InventoryModel.add(req.body);
            return ResponseHelper.Success(res, result);
        }catch(e){
            logger.error('::EX::InventoryController::Add:: Error occured while pricessing request', e.message);
            return ResponseHelper.Error(res, MESSAGES.INTERNAL_ERROR)
        }
    }


    /***
     * @description Retrieves inventory information
     * @param {Object} req
     * @param {Object} res 
     * @returns {Object}
     */
    static async get (req: any, res: any) : Promise<any> {
        try{
            logger.info('Incoming request inventory.controller.ts');
            const { itemName } = req.params

            if(!itemName) {
                return ResponseHelper.Error(res, MESSAGES.BAD_REQUEST)
            }

            const result = await InventoryModel.getQtyOfInventory(itemName.trim());
    
            return ResponseHelper.Success(res, result);
        }catch(e){
            logger.error('::EX::InventoryController::Add:: Error occured while pricessing request');
            return ResponseHelper.Error(res, MESSAGES.INTERNAL_ERROR)
        }
    }


    /***
     * @description Sells an item by reducting its entries in the inventory table
     * @param {Object} req
     * @param {Object} res 
     * @returns {Object}
     */
    static async sell (req: any, res: any) : Promise<any> {
        try{
            logger.info('Incoming request inventory.controller.ts');
            const { quantity } = req.body;

            if(typeof quantity !== 'number'){
                return ResponseHelper.Error(res, MESSAGES.INVALID_QUANTITY)
            }
            
            if(quantity === 0){
                return ResponseHelper.Error(res, MESSAGES.ZERO_QUANTITY)
            }
            
            const { itemName } = req.params

            if(!itemName) {
                return ResponseHelper.Error(res, MESSAGES.BAD_REQUEST)
            }
            
            const result = await InventoryModel.sellItemQty({itemName, quantity});
            return ResponseHelper.Success(res, result);
        }catch(e){
            logger.error('::EX::InventoryController::Add:: Error occured while pricessing request', e.message);
            const message = ErrorUtils.handleSaleError(e);
            if(message !== 'unknown'){
                return ResponseHelper.Error(res, message);
            }
            return ResponseHelper.Error(res, MESSAGES.INTERNAL_ERROR)
        }
    }
};

export default InventoryController;
