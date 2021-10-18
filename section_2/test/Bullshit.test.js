const assert = require('assert');

class Car {
  park() {
    return 'stopped';
  }

  drive() {
    return 'vroom';
  }
}

let car;

describe('Car', () => {
  beforeEach(() => {
    car = new Car();
  })

  it('can park', ( ) => {
    assert.equal(car.park(), 'stopped');
  });

  it('can park', () => {
    assert.equal(car.drive(), 'vroom');
  });
});