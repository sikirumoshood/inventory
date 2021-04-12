import logger from "../../config/logger";
import ResponseHelper from "../helpers/response.helper";
import ValidationHelper from "../helpers/validation.helper";
import InventoryModel from "../models/inventory.model";
import MESSAGES from '../utils/messages';
import ERROR_TYPES from '../utils/error.types';

class InventoryController {
    static async add (req: any, res: any) : Promise<any> {
        try{
            logger.info('Incoming request inventory.controller.ts');
            const { expiry = null, quantity = null } = req.body;
            const { itemName } = req.params

            // TODO item check [remove]: Can this route be accessed without item path ???
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

    static async get (req: any, res: any) : Promise<any> {
        try{
            logger.info('Incoming request inventory.controller.ts');
            const { itemName } = req.params

            // TODO [remove]: Can this route be accessed without item path ???
            if(!itemName) {
                return ResponseHelper.Error(res, MESSAGES.BAD_REQUEST)
            }

            const result = await InventoryModel.getQtyOfInventory(itemName);
    
            return ResponseHelper.Success(res, result);
        }catch(e){
            logger.error('::EX::InventoryController::Add:: Error occured while pricessing request');
            return ResponseHelper.Error(res, MESSAGES.INTERNAL_ERROR)
        }
    }

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

            // TODO [remove]: Can this route be accessed without item path ???
            if(!itemName) {
                return ResponseHelper.Error(res, MESSAGES.BAD_REQUEST)
            }

            const result = await InventoryModel.sellItemQty({itemName, quantity});
            return ResponseHelper.Success(res, result);
        }catch(e){
            logger.error('::EX::InventoryController::Add:: Error occured while pricessing request', e.message);
            if(e.message === ERROR_TYPES.SELL_REQUEST_ABOVE_LIMIT){
                return ResponseHelper.Error(res, MESSAGES.MAXIMUM_SALE_REACHED);
            }
            return ResponseHelper.Error(res, MESSAGES.INTERNAL_ERROR)
        }
    }
};

export default InventoryController;
