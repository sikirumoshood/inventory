/* eslint-env mocha */
import chai from 'chai';
import sinon from 'sinon';
import ErrorUtils from '../../../app/utils/error.util';
import MESSAGES from '../../../app/utils/messages';

const expect = chai.expect;
let sandbox: any;

describe('Unit Test: ErrorUtils Class', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

   it('Should return the correct error message', () => {
      const expectedResponse1: string = MESSAGES.MAXIMUM_SALE_REACHED;
      const expectedResponse2: string = MESSAGES.ITEM_NOT_IN_STOCK;
      const expectedResponse3: string = 'unknown';
      
      const stockLimitError = { message: 'QTY_REQUESTED_ABOVE_STOCK_LIMIT' };
      const notInStockError = { message: 'ITEM_NO_LONGER_IN_STOCK' };
      const unknownError = { message: 'unknown' }
      const result1 = ErrorUtils.handleSaleError(stockLimitError);
      const result2 = ErrorUtils.handleSaleError(notInStockError);;
      const result3 = ErrorUtils.handleSaleError(unknownError);
      expect(result1).to.eql(expectedResponse1);
      expect(result2).to.eql(expectedResponse2);
      expect(result3).to.eql(expectedResponse3);
   });  
});
