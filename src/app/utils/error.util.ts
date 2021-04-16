import MESSAGES from './messages';

class ErrorUtils {
    static handleSaleError (e: any): string {
        switch(e.message){
            case 'QTY_REQUESTED_ABOVE_STOCK_LIMIT': return MESSAGES.MAXIMUM_SALE_REACHED;
            case 'ITEM_NO_LONGER_IN_STOCK': return MESSAGES.ITEM_NOT_IN_STOCK;
            default: return 'unknown'   
        }
    }
}

export default ErrorUtils;
