import moment from 'moment';

class ValidationHelper {
    static epochInFuture (epochMilliseconds: number): boolean{
        return  epochMilliseconds > moment().valueOf();
    }
    
    static isNumber (value: any): boolean {
        return typeof value === 'number';
    }
}

export default ValidationHelper;
