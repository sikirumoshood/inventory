/* eslint-env mocha */
import chai from 'chai';
import sinon from 'sinon';
import ResponseHelper from '../../../app/helpers/response.helper';
import { Empty } from '../../../app/types/intenvory.types';


const expect = chai.expect;
let sandbox: any;

describe('Unit Test: ResponseHelper', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

   it('Should return the correct success response', () => {
      const res = {
          status () { return this },
          json (data: object) { return data }
      }

      const data = {}
      const expectedResponse: Empty = {}; 
      const result = ResponseHelper.Success(res, data);
      expect(result).to.be.an('object');
      expect(result).to.eql(expectedResponse);
   });

   it('Should return the correct error response', () => {
    const res = {
        status () { return this },
        json (data: string) { return data }
    }

    const data = 'Something went wrong'
    const expectedResponse: object = { msg: 'Something went wrong' };
    const result = ResponseHelper.Error(res, data);
    expect(result).to.be.an('object');
    expect(result).to.eql(expectedResponse);
 });
    
});
