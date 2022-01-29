import assert from 'assert';
import { AlternatePriceSearchEngine } from '../src/BL/PriceSearchEngines/AlternatePriceSearchEngine';

describe('grabFirstPartAsNumber', function () {
    describe('when "20,00 price" is passed', function () {
        it('it should return 20', function () {
            const base = new AlternatePriceSearchEngine();
            assert.equal(base.grabFirstPartAsNumber('20,00 price'), 20);
        });
    });

    describe('when nothing is passed', function () {
        it('should return undefined', function () {
            const base = new AlternatePriceSearchEngine();
            assert.equal(base.grabFirstPartAsNumber(''), undefined);
        });
    });

    describe('when nothing is passed', function () {
        it('should return undefined', function () {
            const base = new AlternatePriceSearchEngine();
            assert.equal(base.grabFirstPartAsNumber(''), undefined);
        });
    });

    describe('when the first part is not a number', function () {
        it('should return NaN', function () {
            const base = new AlternatePriceSearchEngine();
            assert.equal(base.grabFirstPartAsNumber('price 20,00'), NaN);
        });
    });
});
