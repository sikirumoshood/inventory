import moment from 'moment';

class ValidationHelper {
    /***
     * @description Determines if the epoch provided is in the future
     * @param {number} epochMilliseconds
     * @returns {boolean} 
     */
    static epochInFuture (epochMilliseconds: number): boolean{
        return  epochMilliseconds > moment().valueOf();
    }
    
    
    /**
     * @description Determines if the supplied value is a number
     * @param {any} value 
     * @returns {boolean}
     */
    static isNumber (value: any): boolean {
        return typeof value === 'number';
    }
}

export default ValidationHelper;
